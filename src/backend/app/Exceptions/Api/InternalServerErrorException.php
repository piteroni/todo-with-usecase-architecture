<?php

namespace App\Exceptions\Api;

use App\Enums\HttpStatusCode;

class InternalServerErrorException extends ApiException
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        $this->setStatusCode(HttpStatusCode::INTERNAL_SERVER_ERROR);

        if ($this->message === '') {
            $this->setErrorMessage('内部的なエラーが発生しました');
        }

        return parent::toResponse($request);
    }
}