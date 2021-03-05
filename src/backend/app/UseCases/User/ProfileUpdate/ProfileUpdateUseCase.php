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
     * @param array $params
     *   ユーザー情報更新データ.
     * @return array
     *   更新後のユーザー情報.
     * @throws \Exception
     *   ログインユーザーが設定されていない場合に送出される.
     */
    public function updateProfile(array $params): array
    {
        /** @var \App\Models\User */
        $user = Auth::user();

        if (key_exists('username', $params)) {
            $user->name = $params['username'];
        }

        if (key_exists('email', $params)) {
            $user->email = $params['email'];
        }

        if (key_exists('password', $params)) {
            $user->password = Hash::make($params['password']);
        }

        if (!empty($params)) {
            $user->save();
        }

        $profile = $user->only('name', 'email');

        return [
            'username' => $profile['name'],
            'email' => $profile['email'],
        ];
    }
}
