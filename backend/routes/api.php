<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Auth\AuthController;
// use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\URL;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);


// Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
//     $request->fulfill();

//     return response()->json([
//         'message' => 'Email verified successfully'
//     ]);
// })->middleware(['signed'])->name('verification.verify');
Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {

    if (! URL::hasValidSignature($request)) {
        return redirect('http://localhost:5173/login?error=invalid');
    }

    $user = User::find($id);

    if (! $user) {
        return redirect('http://localhost:5173/login?error=user-not-found');
    }

    if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
        return redirect('http://localhost:5173/login?error=invalid-hash');
    }

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return redirect('http://localhost:5173/login?verified=1');

})->middleware(['signed'])->name('verification.verify');

// Protected route
Route::middleware('api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');
});

// Customer route
Route::apiResource('customers', CustomerController::class);

// Item route
Route::apiResource('items', ItemController::class);

// Invoice Route
Route::get('/invoices/next-number', [InvoiceController::class, 'nextNumber']);
Route::apiResource('invoices', InvoiceController::class);
