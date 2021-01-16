<?php

namespace App\Exceptions\Api;

use App\Enums\HttpStatusCode;

class BadRequestException extends ApiException
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        $this->setStatusCode(HttpStatusCode::BAD_REQUEST);

        if ($this->message === '') {
            $this->setErrorMessage('無効なリクエストデータです');
        }

        return parent::toResponse($request);
    }
}