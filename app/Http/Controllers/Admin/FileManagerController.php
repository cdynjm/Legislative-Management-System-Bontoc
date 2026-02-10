<?php

namespace App\Http\Controllers\Admin;

use App\Models\Categories;
use App\Models\Files;
use App\Models\CoAuthor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\AESCipher;

class FileManagerController extends Controller
{
    public function __construct(protected AESCipher $aes) {}

    public function index()
    {
        return Inertia::render('Admin/File-Manager');
    }

    public function createCategory(Request $request) {
        $request->validate([
            'category' => ['required','string','max:255'],
        ]);

        Categories::create([
            'category' => $request->category,
            'parentID' => 0,
        ]);
    }

    public function updateCategory(Request $request) {
        $request->validate([
            'category' => ['required','string','max:255'],
        ]);

        Categories::where('id', $this->aes->decrypt($request->id))->update([
            'category' => $request->category,
        ]);
    }

    public function deleteCategory(Request $request) {
        Categories::where('id', $this->aes->decrypt($request->id))->delete();
        Categories::where('parentID', $this->aes->decrypt($request->id))->delete();
        Files::where('categoryID', $this->aes->decrypt($request->id))->delete();
        CoAuthor::where('categoryID', $this->aes->decrypt($request->id))->delete();
    }
    
}
