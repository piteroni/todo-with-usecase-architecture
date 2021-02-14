<?php

namespace App\Http\Requests\User;

use App\Http\Requests\ApiRequest;

class TaskCreateRequest extends ApiRequest
{
    public function rules(): array
    {
        return [
            'taskName' => 'required|string|max:256',
        ];
    }
}
