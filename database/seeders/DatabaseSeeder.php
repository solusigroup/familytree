<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create superadmin user
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            [
                'name' => env('ADMIN_NAME', 'admin'),
                'password' => bcrypt(env('ADMIN_PASSWORD', 'ChangeMe!SecureP@ss123')),
                'email_verified_at' => now(),
                'role' => 'superadmin',
                'status' => 'active',
            ]
        );

        $this->call([
            FamilyMemberSeeder::class,
        ]);
    }
}
