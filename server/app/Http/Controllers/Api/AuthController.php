<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Delete any existing tokens
            $user->tokens()->delete();
            
            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return ApiResponse::success(
                 [
                    'user' => $user,
                    'token' => $token,
                ],
                'OK',
            201);
        } catch (ValidationException $e) {
            return ApiResponse::error(
               'Registration failed due to validation errors',
                422,
                $e->errors()
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Registration failed. Please try again later.',
                500,
                $e->getMessage()
            );
        }
    }

    public function login(Request $request)
    {
        try
        {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if (!Auth::attempt($request->only('email', 'password')))
            {
                return ApiResponse::error(
                    'Invalid credentials',
                    401
                );
            }

            $user = Auth::user();

            // Delete any existing tokens
            $user->tokens()->delete();

            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return ApiResponse::success(
                [
                    'user' => $user,
                    'token' => $token,
                ]
            );
        } catch (ValidationException) {
            return ApiResponse::error(
                'Invalid credentials',
                401
            );
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Logon failed. Please try again later.',
                500,
                $e->getMessage()
            );
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success();
    }

    public function user(Request $request)
    {
        return ApiResponse::success($request->user());
    }
} 