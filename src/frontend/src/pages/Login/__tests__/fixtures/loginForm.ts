import flushPromises from "flush-promises";
import { apiToken, ApiTokenActions } from "@/store/modules/apiToken";
import { UnauthorizedError } from "@/api/exceptions";

// 通常のスタブ
export const apiTokenStub = apiToken.clone();

export const fetchApiTokenMock = jest.fn();

apiTokenStub.options.actions = class extends ApiTokenActions {
  public async fetchApiToken() {
    fetchApiTokenMock();
  }
};

// 認証失敗を表現するスタブ
export const apiTokenStubWithAuthFailure = apiToken.clone();

export const fetchApiTokenMockWithAuthFailure = jest.fn(() => {
  throw new UnauthorizedError("message", 1, "code");
});

apiTokenStubWithAuthFailure.options.actions = class extends ApiTokenActions {
  public async fetchApiToken() {
    fetchApiTokenMockWithAuthFailure();
  }
};

/**
 * 認証処理が完了するまで待つ.
 */
export const waitUntilAuthenticated = async (): Promise<void> => {
  await flushPromises();
};
