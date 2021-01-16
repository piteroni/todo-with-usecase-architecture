<?php

namespace App\Http\Requests;

/**
 * 値の型キャスト機能を提供する.
 */
trait TypeCastable
{
    /**
     * リクエストに適用されるキャストルールを表す.
     * 
     * @return array
     *   キャストルール.
     */
    protected function casts(): array
    {
        return [];
    }

    /**
     * 指定されたキャスト命令に応じて、値のキャストを行う.
     * 
     * @param string $type
     *   キャスト先の型名.
     * @param mixed $value
     *   キャスト対象となる値.
     * @return mixed
     *   キャストされた値.
     */
    private function cast(string $type, $value)
    {
        switch ($type) {
            case 'integer':
                if (!is_int($value)) {
                    throw new InvalidCastException([
                        'message' => '整数のキャストに失敗しました',
                        'type' => $type,
                        'value' => $value
                    ]);
                }

                return (int) $value;
            case 'boolean':
                if ($value === 'true') {
                    return true;
                }

                if ($value === 'false') {
                    return false;
                }

                throw new InvalidCastException([
                    'message' => '真偽値のキャストに失敗しました',
                    'type' => $type,
                    'value' => $value
                ]);
            case 'string':
                return (string) $value;
            case 'json':
                $decoded = json_decode($value);

                if (is_null($decoded)) {
                    throw new InvalidCastException([
                        'message' => 'オブジェクトのキャストに失敗しました',
                        'type' => $type,
                        'value' => $value
                    ]);
                }

                return $decoded;
            default:
                return $value;                
        }
    }
}
