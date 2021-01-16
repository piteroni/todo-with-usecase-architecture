<?php

namespace App\Exceptions\Api;

use App\Enums\HttpStatusCode;

class UnprocessableEntityException extends ApiException
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        $this->setStatusCode(HttpStatusCode::UNPROCESSABLE_ENTITY);

        if ($this->message === '') {
            $this->setErrorMessage('処理できないエンティティです');
        }

        return parent::toResponse($request);
    }
}