<?php

namespace App\Http\Requests;

use App\Exceptions\Api\UnprocessableEntityException;
use App\Exceptions\Core\Serializable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

/**
 * リクエスト内容の検証、及び調節を行う.
 */
class ApiRequest extends FormRequest
{
    /**
     * 失敗したバリデーションのハンドリングを行う.
     *
     * @param  \Illuminate\Contracts\Validation\Validator $validator
     * @throws \App\Exceptions\Api\UnprocessableEntityException
     */
    protected function failedValidation(Validator $validator): void
    {
        $messages = [
            'message' => 'バリデーションに失敗しました',
            'called' => get_called_class(),
            'errors' => $validator->errors()
        ];

        $exception = new RequestValidateionException($messages);

        throw new UnprocessableEntityException($this->route()->getName(), '', $exception);
    }
}

class RequestValidateionException extends Serializable {}
