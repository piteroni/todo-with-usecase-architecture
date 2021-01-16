<?php

namespace App\Http\Requests\Identification;

use App\Http\Requests\ApiRequest;

class LoginRequest extends ApiRequest
{
    public function rules(): array
    {
        return [
            'email' => 'required|string|max:256',
            'password' => 'required|string|max:256',
        ];
    }
}
