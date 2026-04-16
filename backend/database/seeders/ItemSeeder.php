<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Item;
use Faker\Factory as Faker;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $faker = Faker::create();
        foreach (range(1, 25) as $index) {
            Item::create([
                'name' => $faker->word,
                'price' => $faker->numberBetween(10, 100),
                'description' => $faker->word,
                // add other fields
            ]);
        }
    }
}
