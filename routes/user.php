<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\ElectedOfficialsController;
use App\Http\Controllers\User\FileManagerController;
use App\Http\Controllers\User\FileController;
use App\Http\Controllers\User\ViewFileController;

Route::middleware(['auth', 'user'])->group(function () {
    Route::prefix('user')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('user.dashboard');
        Route::get('/elected-officials', [ElectedOfficialsController::class, 'index'])->name('user.elected-officials');
        Route::get('/file-manager', [FileManagerController::class, 'index'])->name('user.file-manager');
        Route::get('/files/{id}', [FileController::class, 'index'])->name('user.files');
        Route::get('/view-file/{id}', [ViewFileController::class, 'index'])->name('user.view-file');
    });
});