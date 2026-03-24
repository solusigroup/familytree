<?php

namespace Database\Seeders;

use App\Models\FamilyMember;
use Illuminate\Database\Seeder;

class FamilyMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generasi 1 - Pendiri
        $aliDahlan = FamilyMember::create([
            'name' => 'Ali Dahlan',
            'gender' => 'male',
            'birth_date' => '1920-01-01',
            'death_date' => '1990-06-15',
            'birth_place' => 'Pekalongan',
            'bio' => 'Pendiri keluarga besar Bani Ali Dahlan. Seorang tokoh masyarakat yang disegani.',
            'generation' => 1,
        ]);
        $istriAli = $aliDahlan->spouses()->create(['name' => 'Siti Aminah', 'gender' => 'female']);

        // Generasi 2 - Anak-anak Ali Dahlan
        $ahmad = FamilyMember::create([
            'name' => 'Ahmad Ali',
            'gender' => 'male',
            'birth_date' => '1945-03-10',
            'birth_place' => 'Pekalongan',
            'bio' => 'Anak pertama Ali Dahlan.',
            'parent_id' => $aliDahlan->id,
            'parent_spouse_id' => $istriAli->id,
            'generation' => 2,
        ]);
        $istriAhmad = $ahmad->spouses()->create(['name' => 'Fatimah', 'gender' => 'female']);

        $khadijah = FamilyMember::create([
            'name' => 'Khadijah Ali',
            'gender' => 'female',
            'birth_date' => '1948-07-22',
            'birth_place' => 'Pekalongan',
            'bio' => 'Anak kedua Ali Dahlan.',
            'parent_id' => $aliDahlan->id,
            'parent_spouse_id' => $istriAli->id,
            'generation' => 2,
        ]);
        $suamiKhadijah = $khadijah->spouses()->create(['name' => 'Ibrahim', 'gender' => 'male']);

        $muhammad = FamilyMember::create([
            'name' => 'Muhammad Ali',
            'gender' => 'male',
            'birth_date' => '1952-11-05',
            'birth_place' => 'Jakarta',
            'bio' => 'Anak ketiga Ali Dahlan.',
            'parent_id' => $aliDahlan->id,
            'parent_spouse_id' => $istriAli->id,
            'generation' => 2,
        ]);
        $istriMuhammad1 = $muhammad->spouses()->create(['name' => 'Zahra', 'gender' => 'female']);
        $istriMuhammad2 = $muhammad->spouses()->create(['name' => 'Siti Khomsiyah', 'gender' => 'female']); // Added for multiple spouses testing

        // Generasi 3 - Cucu Ali Dahlan (Anak Ahmad)
        FamilyMember::create([
            'name' => 'Yusuf Ahmad',
            'gender' => 'male',
            'birth_date' => '1970-02-14',
            'birth_place' => 'Jakarta',
            'bio' => 'Anak pertama Ahmad Ali.',
            'parent_id' => $ahmad->id,
            'parent_spouse_id' => $istriAhmad->id,
            'generation' => 3,
        ]);

        FamilyMember::create([
            'name' => 'Maryam Ahmad',
            'gender' => 'female',
            'birth_date' => '1973-09-30',
            'birth_place' => 'Jakarta',
            'bio' => 'Anak kedua Ahmad Ali.',
            'parent_id' => $ahmad->id,
            'parent_spouse_id' => $istriAhmad->id,
            'generation' => 3,
        ]);

        // Generasi 3 - Cucu Ali Dahlan (Anak Khadijah)
        FamilyMember::create([
            'name' => 'Zainab Ibrahim',
            'gender' => 'female',
            'birth_date' => '1972-05-18',
            'birth_place' => 'Semarang',
            'bio' => 'Anak pertama Khadijah Ali.',
            'parent_id' => $khadijah->id,
            'parent_spouse_id' => $suamiKhadijah->id,
            'generation' => 3,
        ]);

        // Generasi 3 - Cucu Ali Dahlan (Anak Muhammad)
        FamilyMember::create([
            'name' => 'Abdullah Muhammad',
            'gender' => 'male',
            'birth_date' => '1978-12-01',
            'birth_place' => 'Surabaya',
            'bio' => 'Anak pertama Muhammad Ali dari Istri Pertama.',
            'parent_id' => $muhammad->id,
            'parent_spouse_id' => $istriMuhammad1->id,
            'generation' => 3,
        ]);

        FamilyMember::create([
            'name' => 'Halimah Muhammad',
            'gender' => 'female',
            'birth_date' => '1980-04-25',
            'birth_place' => 'Surabaya',
            'bio' => 'Anak kedua Muhammad Ali dari Istri Pertama.',
            'parent_id' => $muhammad->id,
            'parent_spouse_id' => $istriMuhammad1->id,
            'generation' => 3,
        ]);

        FamilyMember::create([
            'name' => 'Umar Muhammad',
            'gender' => 'male',
            'birth_date' => '1985-06-12',
            'birth_place' => 'Surabaya',
            'bio' => 'Anak Muhammad Ali dari Istri Kedua (Poligami).',
            'parent_id' => $muhammad->id,
            'parent_spouse_id' => $istriMuhammad2->id,
            'generation' => 3,
        ]);
    }
}
