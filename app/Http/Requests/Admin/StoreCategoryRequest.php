<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // baadaye tutaongeza policy
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'status'      => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Jina la category ni lazima.',
            'image.image'   => 'Faili lazima iwe picha.',
            'image.mimes'   => 'Picha inaruhusiwa: jpeg, png, jpg, webp.',
            'image.max'     => 'Ukubwa wa picha usizidi 2MB.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'status' => $this->boolean('status', true),
        ]);
    }
}