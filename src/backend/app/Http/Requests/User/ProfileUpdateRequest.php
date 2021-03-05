<?php

namespace App\Http\Requests\User;

use App\Http\Requests\ApiRequest;

class ProfileUpdateRequest extends ApiRequest
{
    public function rules()
    {
        return [
            'username' => 'string|max:256',
            'email' => 'string|max:256',
            'password' => 'string|max:256',
        ];
    }
}
