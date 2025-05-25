<?php

use App\Helpers\ApiResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ApiResponse::success(['Laravel' => app()->version()]);
});

Route::get('login', function () {
    return ApiResponse::error('Authentication required', 401);
})->name('login');