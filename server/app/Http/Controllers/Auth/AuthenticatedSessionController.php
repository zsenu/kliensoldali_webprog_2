<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        try {
            $request->authenticate();

            $user = $request->user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return ApiResponse::success([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'created_at' => $user->created_at
                    ],
                    'token' => $token
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::error(
                'Invalid credentials',
                401,
                $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Login failed',
                500,
                $e->getMessage());
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return ApiResponse::success();
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Logout failed',
                500,
                $e->getMessage());
        }
    }
}
