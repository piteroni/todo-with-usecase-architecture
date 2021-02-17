<?php

namespace App\Exceptions;

use App\Exceptions\Api\ApiException;
use Exception;

trait ExceptionFormattable
{
    /**
     * 例外情報を文字列にフォーマットし取得する.
     *
     * @param \App\Exceptions\Api\ApiException $exception
     *   Api 例外オブジェクト.
     * @param \Exception $previous
     *   派生元例外オブジェクト.
     * @return
     *   フォーマットされた例外情報.
     */
    private function formatApiException(ApiException $exception, Exception $previous, array $contexts): string
    {
        $previousName = get_class($previous);

        if ($previous instanceof Serializable) {
            $reasonKeyName = 'context';
            $message = json_decode($previous->getMessage(), JSON_OBJECT_AS_ARRAY);
        } else {
            $reasonKeyName = 'message';
            $message = $previous->getMessage();
        }

        $details = array_merge($contexts, [
            'operationId' => $exception->getErrorCode(),
            $reasonKeyName => $message,
        ]);
        $details = json_encode($details, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $stacktrace = "[stacktrace]\n{$previous->getTraceAsString()}";

        return "$previousName at {$previous->getFile()}({$previous->getLine()})\n$details\n$stacktrace";
    }
}
