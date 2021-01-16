<?php

namespace App\Exceptions\Api;

use App\Enums\HttpStatusCode;

class ForbiddenException extends ApiException
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        $this->setStatusCode(HttpStatusCode::FORBIDDEN);

        if ($this->message === '') {
            $this->setErrorMessage('操作は許可されていません');
        }

        return parent::toResponse($request);
    }
}