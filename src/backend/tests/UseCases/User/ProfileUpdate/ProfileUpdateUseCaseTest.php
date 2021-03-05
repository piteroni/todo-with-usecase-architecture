<?php

use App\UseCases\User\ProfileUpdate\ProfileUpdateUseCase;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileUpdateUseCaseTest extends TestCase
{
    private ProfileUpdateUseCase $profileUpdateUseCase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->profileUpdateUseCase = new ProfileUpdateUseCase();
    }

    /**
     * ログイン中のユーザーのユーザー情報を更新できる.
     */
    public function testProfileUpdate(): void
    {
        $params = [
            'username' => 'test-user',
            'email' => 'test@example.com'
        ];

        $expected = [
            'username' => 'test-user',
            'email' => 'test@example.com'
        ];

        $user = User::factory()->create();

        Auth::setUser($user);

        $actial = $this->profileUpdateUseCase->updateProfile($params);

        // 更新したユーザーのユーザー情報が返ってくる
        $this->assertEquals($expected, $actial);
    }

    /**
     * ユーザー名を指定すると、ログイン中のユーザーのユーザー名を更新できる.
     */
    public function testUsernameUpdate(): void
    {
        $params = [
            'username' => 'test-username-update',
        ];

        $user = User::factory()->create();

        Auth::setUser($user);

        $this->profileUpdateUseCase->updateProfile($params);

        $actual = User::find($user->id)->name;

        $this->assertEquals('test-username-update', $actual);
    }

    /**
     * ユーザー名を指定しない場合、ユーザー名は更新されない.
     */
    public function testUnSpecifiedUsername(): void
    {
        $params = [
            'email' => 'test@exeample.com',
        ];

        $user = User::factory()->create([
            'name' => 'original-name'
        ]);

        Auth::setUser($user);

        $this->profileUpdateUseCase->updateProfile($params);

        $actual = User::find($user->id)->name;

        $this->assertEquals('original-name', $actual);
    }

    /**
     * メールアドレスを指定すると、ログイン中のユーザーのメールアドレスを更新できる.
     */
    public function testEmailUpdate(): void
    {
        $params = [
            'email' => 'test-email@example.com',
        ];

        $user = User::factory()->create();

        Auth::setUser($user);

        $this->profileUpdateUseCase->updateProfile($params);

        $actual = User::find($user->id)->email;

        $this->assertEquals('test-email@example.com', $actual);
    }

    /**
     * メールアドレスを指定しない場合、メールアドレスは更新されない.
     */
    public function testUnSpecifiedEmail(): void
    {
        $params = [
            'username' => 'username',
        ];

        $user = User::factory()->create([
            'email' => 'original@example.com'
        ]);

        Auth::setUser($user);

        $this->profileUpdateUseCase->updateProfile($params);

        $actual = User::find($user->id)->email;

        $this->assertEquals('original@example.com', $actual);
    }

    /**
     * パスワードを指定すると、ログイン中のユーザーのパスワードをハッシュ化したパスワードに更新できる.
     */
    public function testPasswordUpdate(): void
    {
        $params = [
            'password' => 'test-password',
        ];

        $user = User::factory()->create();

        Auth::setUser($user);

        $this->profileUpdateUseCase->updateProfile($params);

        $password = User::find($user->id)->password;

        $this->assertTrue(Hash::check('test-password', $password));
    }

    /**
     * メールアドレスを指定しない場合、メールアドレスは更新されない.
     */
    public function testUnSpecifiedPassword(): void
    {
        $params = [
            'name' => 'username',
        ];

        $user = User::factory()->create([
            'password' => 'original-password'
        ]);

        Auth::setUser($user);

        $this->profileUpdateUseCase->updateProfile($params);

        $actual = User::find($user->id)->password;

        $this->assertEquals('original-password', $actual);
    }

    /**
     * 空の入力を渡した場合、ログイン中のユーザーのユーザー情報は更新されない.
     */
    public function testEmptyInput(): void
    {
        $params = [];

        $user = User::factory()->create([
            'name' => 'test-username',
            'email' => 'test@example.com',
            'password' => 'test-password'
        ]);

        $beforeUpdatedAt = $user->updated_at;

        $expected = [
            'username' => 'test-username',
            'email' => 'test@example.com',
        ];

        Auth::setUser($user);

        $actual = $this->profileUpdateUseCase->updateProfile($params);

        $afterUpdatedAt = $user->updated_at;

        $this->assertEquals($expected, $actual);
        $this->assertEquals($beforeUpdatedAt, $afterUpdatedAt);
    }
}
