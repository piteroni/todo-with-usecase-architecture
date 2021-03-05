<?php

namespace App\Http\Requests\User;

use App\Http\Requests\ApiRequest;

class ProfileUpdateRequest extends ApiRequest
{
    public function rules()
    {
        // @todo: Laravelでそれ以外が含まれないことっていうのは表現出来ないかね...
        return [
            'name' => 'string|max:256',
            'email' => 'string|max:256',
            'password' => 'string|max:256',
        ];
    }
}
