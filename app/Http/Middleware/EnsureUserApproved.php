<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserApproved
{
    /**
     * Handle an incoming request.
     * Redirect pending/rejected users away from protected routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if ($user->isRejected()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('status', 'Akun Anda telah ditolak oleh administrator.');
        }

        if ($user->isPendingStatus()) {
            return redirect()->route('pending-approval');
        }

        return $next($request);
    }
}
