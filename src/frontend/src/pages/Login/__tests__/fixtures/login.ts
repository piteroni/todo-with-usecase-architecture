import { ServerError, UnauthorizedError } from "@/api/exceptions";
import { ApiTokenActions } from "@/store/modules/apiToken";

export const verifyCrediantialsMock = jest.fn();

export class ApiTokenActionsMockWithAuthFailure extends ApiTokenActions {
  // 認証例外を発生させるようにする
  public async verifyCrediantials() {
    verifyCrediantialsMock();
    throw new UnauthorizedError("message", 1, "code");
  }
}

export class ApiTokenActionsMockWithAuthed extends ApiTokenActions {
  public setUpToken(): void {
    this.state.token = "token";
  }

  public async verifyCrediantials(): Promise<void> {
    verifyCrediantialsMock();
  }
}
export class ApiTokenActionsMockWithException extends ApiTokenActions {
  public setUpToken(): void {
    this.state.token = "token";
  }

  // UnauthorizedError以外を発生させるようにする
  public async verifyCrediantials(): Promise<void> {
    verifyCrediantialsMock();

    throw new ServerError("message");
  }
}
