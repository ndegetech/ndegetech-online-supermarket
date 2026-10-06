<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:255'],
            'category_id'     => ['required', 'exists:categories,id'],
            'brand'           => ['nullable', 'string', 'max:100'],
            'model'           => ['nullable', 'string', 'max:100'],
            'description'     => ['nullable', 'string'],
            'specifications'  => ['nullable', 'string'],
            'price'           => ['required', 'numeric', 'min:0'],
            'old_price'       => ['nullable', 'numeric', 'min:0'],
            'availability'    => ['required', Rule::in(['available', 'out_of_stock'])],
            'status'          => ['required', Rule::in(['draft', 'published', 'archived'])],
            'featured'        => ['boolean'],
            'meta_title'      => ['nullable', 'string', 'max:255'],
            'meta_description'=> ['nullable', 'string', 'max:500'],
            'images'          => ['nullable', 'array', 'max:8'],
            'images.*'        => ['image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
            'remove_images'   => ['nullable', 'array'],
            'remove_images.*' => ['integer', 'exists:product_images,id'],
            'primary_image_id'=> ['nullable', 'integer', 'exists:product_images,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'featured' => $this->boolean('featured'),
        ]);
    }
}