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
            ['email' => 'kurniawan@petalmail.com'],
            [
                'name' => 'kurniawan',
                'password' => bcrypt('5@8@12Yaa'),
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
