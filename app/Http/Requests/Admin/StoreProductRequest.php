<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
            'old_price'       => ['nullable', 'numeric', 'min:0', 'gt:price'],
            'availability'    => ['required', Rule::in(['available', 'out_of_stock'])],
            'status'          => ['required', Rule::in(['draft', 'published', 'archived'])],
            'featured'        => ['boolean'],
            'meta_title'      => ['nullable', 'string', 'max:255'],
            'meta_description'=> ['nullable', 'string', 'max:500'],
            'images'          => ['nullable', 'array', 'max:8'],
            'images.*'        => ['image', 'mimes:jpeg,png,jpg,webp', 'max:3072'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'       => 'Jina la product ni lazima.',
            'category_id.required'=> 'Chagua category.',
            'price.required'      => 'Bei ni lazima.',
            'old_price.gt'        => 'Bei ya zamani lazima iwe kubwa kuliko bei ya sasa.',
            'images.*.image'      => 'Faili lazima iwe picha.',
            'images.*.max'        => 'Kila picha isizidi 3MB.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'featured' => $this->boolean('featured'),
        ]);
    }
}