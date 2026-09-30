<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMinEditor
{
    /**
     * Handle an incoming request.
     * Only allow active users with role editor or superadmin.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->isEditorOrAbove()) {
            abort(403, 'Akses terbatas untuk pengguna dengan role minimal Editor.');
        }

        return $next($request);
    }
}
