<?php

namespace App\Http\Resources\Identification;

use Illuminate\Http\Resources\Json\JsonResource;

class ApiToken extends JsonResource
{
    private string $apiToken;

    /**
     * @param  mixed  $resource
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
    public function handle(): array
    {
        return [
            'apiToken' => $this->apiToken
        ];
    }
}
