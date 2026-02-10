<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        if(Auth::guard()->check()) {
            if(Auth::user()->can('accessAdmin')) {
                return redirect()->route('admin.dashboard');
            }
            if(Auth::user()->can('accessUser')) {
                return redirect()->route('user.dashboard');
            }
        }
        else {
            return Inertia::render('Welcome');
        }
    }
}
