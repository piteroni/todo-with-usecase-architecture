<?php

namespace Database\Seeders\Actors\User;

use Illuminate\Support\Facades\Hash;

class User
{
    public static function attributes(): array
    {
        return [
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('password')
        ];
    }
}
