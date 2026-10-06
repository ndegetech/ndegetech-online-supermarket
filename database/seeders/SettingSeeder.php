<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'business_name', 'value' => 'MWANDEGE ONLINE MARKET'],
            ['key' => 'whatsapp_number', 'value' => '255712345678'], // Badilisha na namba yako ya WhatsApp (bila +)
            ['key' => 'business_description', 'value' => 'Electronics, accessories and home essentials carefully selected for you.'],
            ['key' => 'contact_email', 'value' => 'info@mwandege.com'],
            ['key' => 'contact_phone', 'value' => '255712345678'],
            ['key' => 'facebook_url', 'value' => ''],
            ['key' => 'instagram_url', 'value' => ''],
            ['key' => 'tiktok_url', 'value' => ''],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}