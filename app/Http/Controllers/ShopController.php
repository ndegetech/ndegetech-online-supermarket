<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ShopController extends Controller
{
    /**
     * Clean user search input — block XSS / script payloads.
     */
    private function sanitizeSearch(?string $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        // Strip HTML/PHP tags
        $clean = strip_tags($value);

        // Remove null bytes and control characters
        $clean = preg_replace('/[\x00-\x1F\x7F]/u', '', $clean) ?? '';

        // Decode entities then strip again (e.g. &lt;script&gt;)
        $clean = html_entity_decode($clean, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $clean = strip_tags($clean);

        // Block common script patterns (defense in depth)
        $clean = preg_replace('/javascript\s*:/i', '', $clean) ?? '';
        $clean = preg_replace('/on\w+\s*=/i', '', $clean) ?? '';
        $clean = preg_replace('/<\s*script/i', '', $clean) ?? '';

        // Limit length
        $clean = Str::limit(trim($clean), 100, '');

        // Allow only safe characters for product search
        $clean = preg_replace('/[^\p{L}\p{N}\s\-\_\.\,\'\&\+\(\)]+/u', '', $clean) ?? '';

        return trim($clean);
    }

    private function sanitizeSlug(?string $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        $clean = strip_tags($value);
        $clean = preg_replace('/[^a-z0-9\-]/i', '', $clean) ?? '';

        return Str::limit(strtolower(trim($clean)), 80, '');
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 20);
        $allowed = [10, 20, 30, 50, 70, 100];
        if (! in_array($perPage, $allowed, true)) {
            $perPage = 20;
        }

        $search = $this->sanitizeSearch($request->input('search'));
        $categorySlug = $this->sanitizeSlug($request->input('category'));
        $availability = $request->input('availability') === 'available' ? 'available' : '';
        $sort = $request->input('sort', 'newest');
        $allowedSorts = ['newest', 'price_low', 'price_high', 'featured'];
        if (! in_array($sort, $allowedSorts, true)) {
            $sort = 'newest';
        }

        $query = Product::with(['category:id,name,slug', 'primaryImage'])
            ->published()
            ->whereHas('category', function ($q) {
                $q->where('status', true);
            });

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('brand', 'like', '%'.$search.'%')
                    ->orWhere('model', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        if ($categorySlug !== '') {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)->where('status', true);
            });
        }

        if ($availability === 'available') {
            $query->available();
        }

        $query->getQuery()->orders = null;

        match ($sort) {
            'price_low'  => $query->orderBy('price', 'asc')->orderBy('id', 'desc'),
            'price_high' => $query->orderBy('price', 'desc')->orderBy('id', 'desc'),
            'featured'   => $query->orderByDesc('featured')->orderByDesc('created_at'),
            default      => $query->orderByDesc('created_at'),
        };

        $products = $query->paginate($perPage)->withQueryString();

        $categories = Category::where('status', true)
            ->withCount([
                'products' => function ($q) {
                    $q->published();
                },
            ])
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Shop/Index', [
            'products'   => $products,
            'categories' => $categories,
            'filters'    => [
                'search'       => $search,
                'category'     => $categorySlug,
                'availability' => $availability,
                'sort'         => $sort,
                'per_page'     => (string) $perPage,
            ],
        ]);
    }

    public function show(string $slug)
    {
        $slug = $this->sanitizeSlug($slug);

        $product = Product::with(['category:id,name,slug', 'images'])
            ->where('slug', $slug)
            ->published()
            ->whereHas('category', function ($q) {
                $q->where('status', true);
            })
            ->firstOrFail();

        $product->increment('views_count');

        $related = Product::with('primaryImage')
            ->published()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->whereHas('category', function ($q) {
                $q->where('status', true);
            })
            ->take(4)
            ->get();

        return Inertia::render('Shop/Show', [
            'product'        => $product,
            'related'        => $related,
            'whatsappNumber' => Setting::get('whatsapp_number', '255678861389'),
        ]);
    }
}