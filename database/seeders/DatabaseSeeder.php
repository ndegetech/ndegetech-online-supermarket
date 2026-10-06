<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@mwandege.com',
            'password' => bcrypt('password'), // Badilisha password baadaye
        ]);

        $this->call([
            SettingSeeder::class,
            CategorySeeder::class,
        ]);
    }
}