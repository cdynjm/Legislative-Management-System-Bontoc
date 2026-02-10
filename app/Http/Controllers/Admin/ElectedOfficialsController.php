<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Officials;
use App\Http\Controllers\AESCipher;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Carbon;

class ElectedOfficialsController extends Controller
{
    public function __construct(protected AESCipher $aes) {}

    public function index()
    {
        return Inertia::render('Admin/Elected-Officials');
    }

    public function createOfficial(Request $request) {

        $request->validate([
            'email' => ['required','email','max:255',
                Rule::unique('users', 'email'),
            ],
        ]);

        $timestamp = Carbon::now();
        $extension = $request->picture->getClientOriginalExtension();
        $filename = \Str::slug($request->name.'-image-'.$timestamp).'.'.$extension;
        $transferfile = $request->file('picture')->storeAs('profile', $filename, 'public');

        $official = Officials::create([
            'name' => $request->name,
            'address' => $request->address,
            'position' => $request->position,
            'status' => $request->status,
            'photo' => $filename,
        ]);
        
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 2,
            'officialID' => $official->id,
        ]);
    }

    public function updateOfficial(Request $request) 
    {
        $user = User::where('officialID', $this->aes->decrypt($request->id))->first();
        $request->validate([
            'email' => ['required','email','max:255',
                Rule::unique('users', 'email')->ignore($user->id)
            ],
        ]);

        $official = Officials::where('id', $this->aes->decrypt($request->id))->update([
            'name' => $request->name,
            'address' => $request->address,
            'position' => $request->position,
            'status' => $request->status
        ]);

        if($request->picture != null) {

             $official = Officials::where('id', $this->aes->decrypt($request->id))->first();

            if($official->photo != null) {
                File::delete(public_path('storage/profile/'.$official->photo));
            }

            $timestamp = Carbon::now();
            $extension = $request->picture->getClientOriginalExtension();
            $filename = \Str::slug($request->name.'-image-'.$timestamp).'.'.$extension;
            $transferfile = $request->file('picture')->storeAs('profile', $filename, 'public');

            $official = Officials::where('id', $this->aes->decrypt($request->id))->update([
                'photo' => $filename,
            ]);
        }
        
        User::where('officialID', $this->aes->decrypt($request->id))->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if(!empty($request->password)) {
            User::where('officialID', $this->aes->decrypt($request->id))->update([
                'password' => bcrypt($request->password),
            ]);
        }
    }

    public function deleteOfficial(Request $request)
    {
        $official = Officials::where('id', $this->aes->decrypt($request->id))->first();

        if($official->photo != null) {
            File::delete(public_path('storage/profile/'.$official->photo));
        }

        User::where('officialID', $this->aes->decrypt($request->id))->delete();
        Officials::where('id', $this->aes->decrypt($request->id))->delete();
    }
}
