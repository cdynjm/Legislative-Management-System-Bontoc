<?php

namespace App\Http\Controllers\Admin;

use App\Models\Categories;
use App\Models\CoAuthor;
use App\Models\Files;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\AESCipher;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Carbon;

class FileController extends Controller
{
    public function __construct(protected AESCipher $aes) {}

    public function index(Request $request)
    {
        return Inertia::render('Admin/Files', [
            'id' => $request->id,
        ]);
    }

    public function createFile(Request $request)
    {
        $timestamp = Carbon::now()->format('YmdHis'); // Shorter format for filenames
        $title = \Str::slug(\Str::limit($request->title, 70));
        $extension = $request->file('file')->getClientOriginalExtension();
        $filename = "{$title}...-{$timestamp}.{$extension}";
        $transferfile = $request->file('file')->storeAs('files', $filename, 'public');

        $file = Files::create([
            'categoryID' => $this->aes->decrypt($request->categoryID),
            'municipalStatus' => $request->municipalStatus,
            'title' => $request->title,
            'authorID' => $this->aes->decrypt($request->author),
            'file' => $filename,
        ]);

        if ($request->coauthor != null) {
            foreach ($request->coauthor as $coAuthor) {
                CoAuthor::create([
                    'fileID' => $file->id,
                    'officialID' => $this->aes->decrypt($coAuthor),
                    'categoryID' => $this->aes->decrypt($request->categoryID)
                ]);
            }
        }
    }

    public function updateFile(Request $request) 
    {
        $file = Files::where('id', $this->aes->decrypt($request->id))->update([
            'municipalStatus' => $request->municipalStatus,
            'provincialStatus' => $request->provincialStatus == 0 ? null : $request->provincialStatus,
            'title' => $request->title,
            'authorID' => $this->aes->decrypt($request->author),
            'firstReadingDate' => $request->firstReadingDate ?? null,
            'secondReadingDate' => $request->secondReadingDate ?? null,
            'thirdReadingDate' => $request->thirdReadingDate ?? null,
            'ordinanceNumber' => $request->ordinanceNumber ?? null,
            'finalTitle' => $request->finalTitle ?? null,
            'enactmentDate' => $request->enactmentDate ?? null,
            'lceapprovalDate' => $request->lceapprovalDate ?? null,
            'transmittalDate' => $request->transmittalDate ?? null,
            'spslapprovalDate' => $request->spslapprovalDate ?? null,
            'postStatus' => $request->postStatus == 0 ? null : $request->postStatus ,
            'publishStatus' => $request->publishStatus == 0 ? null : $request->publishStatus,
        ]);

        if ($request->file != null) {

            $files = Files::where('id', $this->aes->decrypt($request->id))->first();

            if($file->file != null) {
                File::delete(public_path('storage/files/'.$files->file));
            }

            $timestamp = Carbon::now()->format('YmdHis');
            $title = \Str::slug(\Str::limit($request->title, 70));
            $extension = $request->file('file')->getClientOriginalExtension();
            $filename = "{$title}...-{$timestamp}.{$extension}";
            $transferfile = $request->file('file')->storeAs('files', $filename, 'public');

            Files::where('id', $this->aes->decrypt($request->id))->update([
                'file' => $filename,
            ]);
        }

        CoAuthor::where('fileID', $this->aes->decrypt($request->id))->delete();
        foreach ($request->coauthor as $coAuthor) {
            CoAuthor::create([
                'fileID' => $this->aes->decrypt($request->id),
                'officialID' => $this->aes->decrypt($coAuthor),
                'categoryID' => $request->categoryID,
            ]);
        }
    }

    public function deleteFile(Request $request) 
    {
        $files = Files::where('id', $this->aes->decrypt($request->id))->first();

        if($files->file != null) {
            File::delete(public_path('storage/files/'.$files->file));
        }

        Files::where('id', $this->aes->decrypt($request->id))->delete();
        CoAuthor::where('fileID', $this->aes->decrypt($request->id))->delete();
    }

    public function createSubcategory(Request $request)
    {
        $request->validate([
            'category' => ['required', 'string', 'max:255'],
        ]);

        Categories::create([
            'category' => $request->category,
            'parentID' => $this->aes->decrypt($request->id),
        ]);
    }

    public function updateSubcategory(Request $request) {
        $request->validate([
            'category' => ['required','string','max:255'],
        ]);

        Categories::where('id', $this->aes->decrypt($request->id))->update([
            'category' => $request->category,
        ]);
    }

    public function deleteSubcategory(Request $request) {
        Categories::where('id', $this->aes->decrypt($request->id))->delete();
        Categories::where('parentID', $this->aes->decrypt($request->id))->delete();
        Files::where('categoryID', $this->aes->decrypt($request->id))->delete();
        CoAuthor::where('categoryID', $this->aes->decrypt($request->id))->delete();
    }
}
