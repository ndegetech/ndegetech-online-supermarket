<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\SiteVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts     = Product::count();
        $publishedProducts = Product::where('status', 'published')->count();
        $outOfStock        = Product::where('availability', 'out_of_stock')->count();
        $categories        = Category::count();
        $featured          = Product::where('featured', true)->count();
        $drafts            = Product::where('status', 'draft')->count();
        $productViews      = (int) Product::sum('views_count');

        $visitsToday = 0;
        $visitsWeek  = 0;
        $visitsMonth = 0;
        $visitsTotal = 0;
        $visitsChart = [];

        if (Schema::hasTable('site_visits')) {
            $visitsToday = SiteVisit::whereDate('visited_on', today())->count();
            $visitsWeek  = SiteVisit::where('visited_on', '>=', now()->subDays(7)->toDateString())->count();
            $visitsMonth = SiteVisit::where('visited_on', '>=', now()->subDays(30)->toDateString())->count();
            $visitsTotal = SiteVisit::count();

            $visitsChart = SiteVisit::query()
                ->select(DB::raw('visited_on as date'), DB::raw('COUNT(*) as count'))
                ->where('visited_on', '>=', now()->subDays(13)->toDateString())
                ->groupBy('visited_on')
                ->orderBy('visited_on')
                ->get()
                ->map(fn ($row) => [
                    'date'  => $row->date,
                    'count' => (int) $row->count,
                ]);
        }

        $whatsappClicks = 0;
        if (Schema::hasTable('whatsapp_clicks')) {
            $whatsappClicks = DB::table('whatsapp_clicks')->count();
        }

        $topProducts = Product::query()
            ->orderByDesc('views_count')
            ->take(5)
            ->get(['id', 'name', 'slug', 'views_count', 'price', 'status']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_products'     => $totalProducts,
                'published_products' => $publishedProducts,
                'out_of_stock'       => $outOfStock,
                'categories'         => $categories,
                'featured'           => $featured,
                'drafts'             => $drafts,
                'product_views'      => $productViews,
                'visits_today'       => $visitsToday,
                'visits_week'        => $visitsWeek,
                'visits_month'       => $visitsMonth,
                'visits_total'       => $visitsTotal,
                'whatsapp_clicks'    => $whatsappClicks,
            ],
            'visitsChart' => $visitsChart,
            'topProducts' => $topProducts,
        ]);
    }

    public function clearVisits(Request $request)
    {
        $request->validate([
            'scope' => 'required|in:all,today,week,month',
        ]);

        if (!Schema::hasTable('site_visits')) {
            return back()->with('error', 'Visit tracking table does not exist.');
        }

        $query = SiteVisit::query();

        match ($request->input('scope')) {
            'today' => $query->whereDate('visited_on', today()),
            'week'  => $query->where('visited_on', '>=', now()->subDays(7)->toDateString()),
            'month' => $query->where('visited_on', '>=', now()->subDays(30)->toDateString()),
            default => null,
        };

        $deleted = $query->delete();

        $labels = [
            'all'   => 'all visit history',
            'today' => "today's visits",
            'week'  => 'last 7 days visits',
            'month' => 'last 30 days visits',
        ];

        return back()->with(
            'success',
            "Cleared {$labels[$request->input('scope')]} ({$deleted} records)."
        );
    }

    /**
     * Reset product views_count (all products or one product).
     */
    public function clearProductViews(Request $request)
    {
        $request->validate([
            'scope' => 'required|in:all,product',
            'product_id' => 'nullable|integer|exists:products,id',
        ]);

        if ($request->input('scope') === 'product') {
            if (!$request->filled('product_id')) {
                return back()->with('error', 'Product is required.');
            }

            $product = Product::findOrFail($request->input('product_id'));
            $product->update(['views_count' => 0]);

            // Optional: clear product_views log table if exists
            if (Schema::hasTable('product_views')) {
                DB::table('product_views')->where('product_id', $product->id)->delete();
            }

            return back()->with('success', "Views cleared for \"{$product->name}\".");
        }

        // Clear all
        Product::query()->update(['views_count' => 0]);

        if (Schema::hasTable('product_views')) {
            DB::table('product_views')->truncate();
        }

        return back()->with('success', 'All product views have been cleared.');
    }
}