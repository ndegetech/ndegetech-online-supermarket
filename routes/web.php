<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $featuredProducts = Product::with('primaryImage')
        ->published()
        ->whereHas('category', function ($q) {
            $q->where('status', true);
        })
        ->latest()
        ->take(12)
        ->get();

    // Categories zote active (si take(6))
    $categories = Category::where('status', true)
        ->orderBy('name')
        ->get(['id', 'name', 'slug']);

    return Inertia::render('Home', [
        'featuredProducts' => $featuredProducts,
        'categories'       => $categories,
        'whatsappNumber'   => Setting::get('whatsapp_number', '255678861389'),
    ]);
})->name('home');

Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/products/{slug}', [ShopController::class, 'show'])->name('products.show');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::post('/locale', function (\Illuminate\Http\Request $request) {
    $locale = $request->input('locale', 'en');
    if (! in_array($locale, ['en', 'sw'], true)) {
        $locale = 'en';
    }
    session(['locale' => $locale]);
    app()->setLocale($locale);

    return back();
})->name('locale.switch');

Route::post('/locale', function (\Illuminate\Http\Request $request) {
    $locale = $request->input('locale');
    
    if (in_array($locale, ['en', 'sw'])) {
        session(['locale' => $locale]);
        app()->setLocale($locale);
    }
    
    return back();
})->name('locale.switch');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Admin)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::delete('visits', [DashboardController::class, 'clearVisits'])->name('visits.clear');
        Route::delete('product-views', [DashboardController::class, 'clearProductViews'])->name('product-views.clear');

        Route::resource('categories', CategoryController::class);
        Route::patch('categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])
            ->name('categories.toggle-status');

        Route::resource('products', ProductController::class);
        Route::patch('products/{product}/toggle-status', [ProductController::class, 'toggleStatus'])
            ->name('products.toggle-status');

        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';