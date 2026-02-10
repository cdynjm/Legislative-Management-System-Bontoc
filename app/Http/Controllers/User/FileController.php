<?php

namespace App\Http\Controllers\User;

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
        return Inertia::render('User/Files', [
            'id' => $request->id,
        ]);
    }
}
