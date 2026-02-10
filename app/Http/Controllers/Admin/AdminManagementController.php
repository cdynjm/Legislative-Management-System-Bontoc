<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use App\Http\Controllers\AESCipher;

class AdminManagementController extends Controller
{
    public function __construct(protected AESCipher $aes) {}

    public function index()
    {
        return Inertia::render('Admin/Admin-Management');
    }

    public function createAdmin(Request $request) {

        $request->validate([
            'email' => ['required','email','max:255',
                Rule::unique('users', 'email'),
            ],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 1,
        ]);
    }

    public function updateAdmin(Request $request)
    {
        $request->validate([
            'email' => ['required','email','max:255',
                Rule::unique('users', 'email')->ignore($this->aes->decrypt($request->id))
            ],
        ]);

       $user = User::where('id', $this->aes->decrypt($request->id))->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if(!empty($request->password)) {
            $user = User::where('id', $this->aes->decrypt($request->id))->update([
                'password' => bcrypt($request->password),
            ]);
        }
    }

    public function deleteAdmin(Request $request)
    {
        $user = User::where('id', $this->aes->decrypt($request->id))->delete();
    }

}
