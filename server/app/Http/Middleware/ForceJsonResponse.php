<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Illuminate\Support\Facades\Log;

class ForceJsonResponse
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('ForceJsonResponse middleware is running');
        $request->headers->set('Accept', 'application/json');
        
        $response = $next($request);
        
        Log::info('Response type: ' . get_class($response));
        Log::info('Content-Type before: ' . $response->headers->get('Content-Type'));
        
        if ($response instanceof SymfonyResponse) {
            $response->headers->set('Content-Type', 'application/json');
            
            // If response is HTML, convert it to JSON
            $content = $response->getContent();
            if (is_string($content)) {
                Log::info('Response content type check: ' . $response->headers->get('Content-Type'));
                if (strpos($content, '<!DOCTYPE html>') !== false || strpos($response->headers->get('Content-Type'), 'text/html') !== false) {
                    Log::info('Converting HTML to JSON');
                    $json = [
                        'message' => strip_tags($content),
                        'status' => $response->getStatusCode()
                    ];
                    $response->setContent(json_encode($json));
                }
            }
        }
        
        Log::info('Content-Type after: ' . $response->headers->get('Content-Type'));
        return $response;
    }
} 