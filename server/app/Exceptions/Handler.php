<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */

    /**
     * @param \Illuminate\Http\Request $request
     * @param \Throwable $exception
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request, Throwable $exception): JsonResponse
    {
        Log::info('Exception handler running for: ' . get_class($exception));
        
        $status = 500;
        $message = $exception->getMessage() ?: 'Server Error';

        if ($exception instanceof NotFoundHttpException) {
            Log::info('Handling NotFoundHttpException');
            $status = 404;
            $message = 'Resource not found';
        } elseif ($exception instanceof ValidationException) {
            $status = 422;
            $message = 'Validation failed';
        } elseif ($exception instanceof AuthenticationException) {
            $status = 401;
            $message = 'Unauthenticated';
        } elseif ($exception instanceof HttpException) {
            $status = $exception->getStatusCode();
        }

        Log::info("Returning JSON response with status: $status");
        return new JsonResponse([
            'error' => $message,
            'status' => $status
        ], $status, ['Content-Type' => 'application/json']);
    }
    
}