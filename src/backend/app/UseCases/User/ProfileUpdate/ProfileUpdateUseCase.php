<?php

namespace App\UseCases\User\ProfileUpdate;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * ログインユーザーのユーザー情報更新機能を提供する.
 */
final class ProfileUpdateUseCase
{
    /**
     * ログインユーザーのユーザー情報を更新する.
     *
     * @param array $profile
     *   ユーザー情報更新データ.
     * @return array
     *   更新後のユーザー情報.
     * @throws \Exception
     *   ログインユーザーが設定されていない場合に送出される.
     */
    public function updateProfile(array $profile): array
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if (key_exists('name', $profile)) {
            $user->name = $profile['name'];
        }

        if (key_exists('email', $profile)) {
            $user->email = $profile['email'];
        }

        if (key_exists('password', $profile)) {
            $user->password = Hash::make($profile['password']);
        }

        if (!empty($profile)) {
            $user->save();
        }

        return $user->only('name', 'email');
    }
}
