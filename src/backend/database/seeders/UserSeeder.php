<?php

namespace Database\Seeders;

use App\Models\User;
use Database\Seeders\Actors\User\User as UserActor;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->create(UserActor::attributes());
    }
}
