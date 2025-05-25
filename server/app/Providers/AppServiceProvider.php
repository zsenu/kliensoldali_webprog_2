<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Http\Resources\Json\JsonResource;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     */
    /**
     * Bootstrap any application services.
     */
    public function register(): void
    {
        // Force JSON responses globally
        $this->app->resolving(Request::class, function (Request $request) {
            $request->headers->set('Accept', 'application/json');
        });
    }

    public function boot(): void
    {
        Response::macro('jsonOnly', function ($data, $status = 200) {
            return response()->json($data, $status);
        });

        // Prevent Laravel from wrapping resources in a data key
        JsonResource::withoutWrapping();
    }
}
