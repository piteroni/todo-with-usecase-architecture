<?php

namespace App\UseCases\User\ProfileAcquisition;

use Illuminate\Support\Facades\Auth;

/**
 * ログインユーザーのユーザー情報取得機能を提供する.
 */
final class ProfileAcquisitionUseCase
{
    /**
     * ログインユーザーのユーザー情報を取得する.
     *
     * @return array
     *   ログインユーザーのユーザー情報.
     * @throws \Exception
     *   ログインが実施されていない場合に送出される.
     */
    public function getProfile(): array
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        return $user->only(['name', 'email']);
    }
}
