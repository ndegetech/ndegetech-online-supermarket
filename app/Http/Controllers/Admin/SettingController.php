<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'business_name'        => Setting::get('business_name', ''),
                'whatsapp_number'      => Setting::get('whatsapp_number', ''),
                'business_description' => Setting::get('business_description', ''),
                'contact_email'        => Setting::get('contact_email', ''),
                'contact_phone'        => Setting::get('contact_phone', ''),
                'facebook_url'         => Setting::get('facebook_url', ''),
                'instagram_url'        => Setting::get('instagram_url', ''),
                'tiktok_url'           => Setting::get('tiktok_url', ''),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'business_name'        => 'required|string|max:255',
            'whatsapp_number'      => 'required|string|max:20',
            'business_description' => 'nullable|string|max:2000',
            'contact_email'        => 'nullable|email|max:255',
            'contact_phone'        => 'nullable|string|max:30',
            'facebook_url'         => 'nullable|url|max:500',
            'instagram_url'        => 'nullable|url|max:500',
            'tiktok_url'           => 'nullable|url|max:500',
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value ?? '');
        }

        return back()->with('success', 'Settings zimesasishwa kikamilifu.');
    }
}