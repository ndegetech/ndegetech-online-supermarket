<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = session('locale', 'en');

        // Load translations from JSON file
        $translations = [];
        $path = lang_path("{$locale}.json");

        if (file_exists($path)) {
            $translations = json_decode(file_get_contents($path), true) ?? [];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            'settings' => [
                'business_name'        => \App\Models\Setting::get('business_name', 'MWANDEGE'),
                'whatsapp_number'      => \App\Models\Setting::get('whatsapp_number', '255678861389'),
                'business_description' => \App\Models\Setting::get('business_description', ''),
                'contact_email'        => \App\Models\Setting::get('contact_email', ''),
                'contact_phone'        => \App\Models\Setting::get('contact_phone', ''),
                'facebook_url'         => \App\Models\Setting::get('facebook_url', ''),
                'instagram_url'        => \App\Models\Setting::get('instagram_url', ''),
                'tiktok_url'           => \App\Models\Setting::get('tiktok_url', ''),
            ],
            'locale' => $locale,
            'translations' => $translations,
        ];
    }
}