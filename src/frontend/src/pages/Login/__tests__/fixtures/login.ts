import { ServerError, UnauthorizedError } from "@/api/exceptions";
import { apiToken, ApiTokenActions } from "@/store/modules/apiToken";

// 通常のスタブ
export const apiTokenStub = apiToken.clone();

apiTokenStub.options.actions = class extends ApiTokenActions {
  // 認証例外を発生させるようにする
  public async verifyCrediantials() {
    throw new UnauthorizedError("message", 1, "code");
  }
};

// 認証済みのスタブ
export const apiTokenStubWithAuthed = apiToken.clone();

apiTokenStubWithAuthed.options.actions = class extends ApiTokenActions {
  // トークンを無条件で更新するようにする
  public setUpToken(): void {
    this.state.token = "token";
  }

  // 認証例外を発生しないように空のメソッドを宣言するようにする
  /* eslint-disable @typescript-eslint/no-empty-function */
  public async verifyCrediantials(): Promise<void> {

  }
};

// 例外を送出するスタブ
export const apiTokenStubWithException = apiToken.clone();

apiTokenStubWithException.options.actions = class extends ApiTokenActions {
  public setUpToken(): void {
    this.state.token = "token";
  }

  public async verifyCrediantials(): Promise<void> {
    throw new ServerError("message");
  }
};
