<?php

namespace App\Exceptions\Api;

use App\Enums\HttpStatusCode;

class UnauthorizedException extends ApiException
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        $this->setStatusCode(HttpStatusCode::UNAUTHORIZED);

        if ($this->errorCode === '') {
            $this->setErrorCode('unauthorized');
        }

        if ($this->message === '') {
            $this->setErrorMessage('ログイン認証が完了していません');
        }

        return parent::toResponse($request);
    }
}