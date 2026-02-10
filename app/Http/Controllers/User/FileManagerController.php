<?php

namespace App\Http\Controllers\User;

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
        return Inertia::render('User/File-Manager');
    }
    
}
