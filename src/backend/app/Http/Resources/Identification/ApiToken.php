<?php

namespace App\Http\Resources\Identification;

use Illuminate\Http\Resources\Json\JsonResource;

class ApiToken extends JsonResource
{
    private string $apiToken;

    /**
     * @param  string  $apiToken
     * @return void
     */
    public function __construct(string $apiToken)
    {
        $this->apiToken = $apiToken;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'apiToken' => $this->apiToken
        ];
    }
}
