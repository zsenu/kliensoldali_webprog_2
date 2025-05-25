<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ScreeningController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;



Route::group(['middleware' => ['api']], function () {
    // Auth routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });

    // Public routes
    Route::get('/movies', [MovieController::class, 'index']);
    Route::get('/movies/week', [MovieController::class, 'byWeek']);
    Route::get('/movies/{movie}', [MovieController::class, 'show']);
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/{room}', [RoomController::class, 'show']);
    Route::get('/screenings', [ScreeningController::class, 'index']);
    Route::get('/screenings/{screening}', [ScreeningController::class, 'show']);


    // Protected routes (require authentication)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Movie management (admin only)
        Route::post('/movies', [MovieController::class, 'store']);
        Route::put('/movies/{movie}', [MovieController::class, 'update']);
        Route::patch('/movies/{movie}', [MovieController::class, 'update']);
        Route::delete('/movies/{movie}', [MovieController::class, 'destroy']);

        // Room management (admin only)
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{room}', [RoomController::class, 'update']);
        Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);

        // Screening management (admin only)
        Route::post('/screenings', [ScreeningController::class, 'store']);
        Route::put('/screenings/{screening}', [ScreeningController::class, 'update']);
        Route::patch('/screenings/{screening}', [ScreeningController::class, 'update']);
        Route::delete('/screenings/{screening}', [ScreeningController::class, 'destroy']);

        // Booking routes (for authenticated users)
        Route::apiResource('bookings', BookingController::class);
    });
});

// all other routes should return 404
Route::any('{any}', function () {
    return response()->json(['message' => 'Page Not Found'], 404);
})->where('any', '.*');
