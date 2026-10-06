<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category:id,name', 'primaryImage'])
            ->withCount('images')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = Category::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function toggleStatus(Product $product)
{
    // Published ↔ Draft (si delete, si archive)
    $product->status = $product->status === 'published' ? 'draft' : 'published';
    $product->save();

    $label = $product->status === 'published' ? 'published' : 'unpublished';

    return back()->with('success', "Product \"{$product->name}\" {$label}.");
}

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $this->generateUniqueSlug($data['name']);

        DB::transaction(function () use ($request, $data) {
            $product = Product::create($data);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    $path = $file->store('products', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image'      => $path,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product imeundwa kikamilifu.');
    }

    public function edit(Product $product)
    {
        $product->load(['images', 'category']);

        $categories = Category::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Products/Edit', [
            'product'    => $product,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();
        $data['slug'] = $this->generateUniqueSlug($data['name'], $product->id);

        DB::transaction(function () use ($request, $product, $data) {
            $product->update($data);

            // Remove selected images
            if (!empty($data['remove_images'])) {
                $imagesToDelete = ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $data['remove_images'])
                    ->get();

                foreach ($imagesToDelete as $img) {
                    Storage::disk('public')->delete($img->image);
                    $img->delete();
                }
            }

            // Upload new images
            if ($request->hasFile('images')) {
                $maxOrder = $product->images()->max('sort_order') ?? -1;

                foreach ($request->file('images') as $file) {
                    $maxOrder++;
                    $path = $file->store('products', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image'      => $path,
                        'is_primary' => false,
                        'sort_order' => $maxOrder,
                    ]);
                }
            }

            // Set primary image
            if (!empty($data['primary_image_id'])) {
                $product->images()->update(['is_primary' => false]);
                $product->images()
                    ->where('id', $data['primary_image_id'])
                    ->update(['is_primary' => true]);
            }
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product imesasishwa kikamilifu.');
    }

    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image);
            }
            $product->images()->delete();
            $product->delete();
        });

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product imefutwa.');
    }

    private function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $original . '-' . $count++;
        }

        return $slug;
    }
}