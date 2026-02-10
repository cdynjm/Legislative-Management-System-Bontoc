<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\AESCipher;
use App\Models\Files;
use App\Models\CoAuthor;
use App\Models\Categories;

class ViewFileController extends Controller
{
    public function __construct(protected AESCipher $aes) {}

    public function index(Request $request)
    {
        return Inertia::render('Admin/View-File', [
            'id' => $request->id,
        ]);
    }
}
