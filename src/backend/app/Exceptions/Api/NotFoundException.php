<?php

namespace App\Exceptions\Api;

use App\Http\HttpStatusCode;

class NotFoundException extends ApiException
{
    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        $this->setStatusCode(HttpStatusCode::NOT_FOUND);

        if ($this->message === '') {
            $this->setErrorMessage('指定されたリソースは存在しません');
        }

        return parent::toResponse($request);
    }
}
