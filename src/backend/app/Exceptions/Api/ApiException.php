<?php

namespace App\Exceptions\Api;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\JsonResponse;
use Exception;
use RuntimeException;

class ApiException extends RuntimeException implements Responsable
{
    /**
     * @var string
     */
    protected $message;

    /**
     * @var int
     */
    protected $statusCode;

    /**
     * @var string
     */
    protected $errorCode;

    /**
     * @var \Exception?
     */
    protected $previous;

    /**
     * @param string $errorCode
     * @param string $message
     * @param \Exception|null $previous
     * @param int $statusCode
     */
    public function __construct($errorCode = '', $message = '', ?Exception $previous = null, $statusCode = 500)
    {
        $this->errorCode = $errorCode;
        $this->message = $message;
        $this->statusCode = $statusCode;
        $this->previous = $previous;
    }

    /**
     * @param string $message
     */
    public function setErrorMessage(string $message): void
    {
        $this->message = $message;
    }

    /**
     * @param int $statusCode
     */
    public function setStatusCode(int $statusCode): void
    {
        $this->statusCode = $statusCode;
    }

    /**
     * @param string $errorCode
     */
    public function setErrorCode(string $errorCode): void
    {
        $this->errorCode = $errorCode;
    }

    /**
     * @return string
     */
    public function getErrorMessage(): string
    {
        return $this->message;
    }

    /**
     * @return int
     */
    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * @return string
     */
    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toResponse($request)
    {
        return new JsonResponse(
            $this->getBasicResponse(),
            $this->getStatusCode()
        );
    }

    /**
     * @return array
     */
    protected function getBasicResponse()
    {
        return [
            'message' => $this->getErrorMessage(),
            'code' => $this->getErrorCode(),
        ];
    }

    public function previous(): ?Exception
    {
        return $this->previous;
    }
}
