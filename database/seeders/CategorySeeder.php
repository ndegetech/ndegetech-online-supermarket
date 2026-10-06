<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Phones & Tablets',
                'description' => 'Smartphones, tablets and mobile devices',
            ],
            [
                'name' => 'Chargers & Cables',
                'description' => 'Phone chargers, USB cables and power banks',
            ],
            [
                'name' => 'Earphones & Speakers',
                'description' => 'Wired and wireless earphones, Bluetooth speakers',
            ],
            [
                'name' => 'TVs & Entertainment',
                'description' => 'Smart TVs and entertainment systems',
            ],
            [
                'name' => 'Home Appliances',
                'description' => 'Blenders, kettles, irons, fans and more',
            ],
            [
                'name' => 'Kitchen Essentials',
                'description' => 'Kitchen tools, cookware and storage',
            ],
            [
                'name' => 'Lighting',
                'description' => 'LED bulbs, rechargeable lamps and emergency lights',
            ],
            [
                'name' => 'Accessories',
                'description' => 'Other electronic accessories',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'status' => true,
                ]
            );
        }
    }
}