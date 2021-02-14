<?php

namespace App\Exceptions;

use App\Exceptions\Api\ApiException;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Exception;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof ApiException && !is_null(($previous = $exception->previous()))) {
            Log::error($this->formatPreviousException($exception, $previous));
        }

        return parent::render($request, $exception);
    }

    /**
     * 派生元例外情報を文字列にフォーマットし取得する.
     *
     * @param \App\Exceptions\Api\ApiException $exception
     *   Api 例外オブジェクト.
     * @param \Exception $previous
     *   派生元例外オブジェクト.
     * @return
     *   フォーマットされた派生元例外情報.
     */
    private function formatPreviousException(ApiException $exception, Exception $previous): string
    {
        $previousName = get_class($previous);

        if ($previous instanceof Serializable) {
            $reasonKeyName = 'context';
            $message = json_decode($previous->getMessage(), JSON_OBJECT_AS_ARRAY);
        } else {
            $reasonKeyName = 'message';
            $message = $previous->getMessage();
        }

        $details = array_merge(parent::context(), [
            'operationId' => $exception->getErrorCode(),
            $reasonKeyName => $message,
        ]);
        $details = json_encode($details, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $stacktrace = "[stacktrace]\n{$previous->getTraceAsString()}";

        return "$previousName at {$previous->getFile()}({$previous->getLine()})\n$details\n$stacktrace";
    }
}
