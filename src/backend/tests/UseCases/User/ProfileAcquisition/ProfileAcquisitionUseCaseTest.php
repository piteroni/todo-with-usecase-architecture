<?php

use App\UseCases\User\ProfileAcquisition\ProfileAcquisitionUseCase;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class ProfileAcquisitionUseCaseTest extends TestCase
{
    /**
     * ログイン中のユーザーのユーザー情報を取得できる.
     */
    public function testUserProfile(): void
    {
        $profileAcquisitionUseCase = new ProfileAcquisitionUseCase();

        $user = User::factory()->create([
            'name' => 'test-user',
            'email' => 'test-user@example.com'
        ]);

        Auth::setUser($user);

        $expected = [
            'name' => 'test-user',
            'email' => 'test-user@example.com'
        ];
        $actual = $profileAcquisitionUseCase->getProfile();

        $this->assertEquals($expected, $actual);
    }
}
