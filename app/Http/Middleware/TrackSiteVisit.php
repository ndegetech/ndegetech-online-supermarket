<?php

namespace App\Http\Middleware;

use App\Models\SiteVisit;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackSiteVisit
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Track public GET only (not admin, not assets)
        if (
            $request->isMethod('GET')
            && !$request->is('admin*')
            && !$request->is('login*')
            && !$request->is('register*')
            && !$request->is('api*')
            && !$request->ajax()
        ) {
            try {
                SiteVisit::create([
                    'path'       => substr($request->path(), 0, 255),
                    'ip'         => $request->ip(),
                    'user_agent' => substr((string) $request->userAgent(), 0, 255),
                    'visited_on' => now()->toDateString(),
                ]);
            } catch (\Throwable $e) {
                // silent fail — don't break the site
            }
        }

        return $response;
    }
}