import flushPromises from "flush-promises";
import { ApiTokenActions } from "@/store/modules/apiToken";
import { UnauthorizedError } from "@/api/exceptions";

export const fetchApiTokenMock = jest.fn();

export class ApiTokenActionsMock extends ApiTokenActions {
  public async fetchApiToken() {
    fetchApiTokenMock();
  }
}

export const fetchApiTokenMockWithAuthFailure = jest.fn();

export class ApiTokenActionsMockWithAuthFailure extends ApiTokenActions {
  public async fetchApiToken() {
    fetchApiTokenMockWithAuthFailure();

    throw new UnauthorizedError("message", 1, "code");
  }
}

/**
 * 認証処理が完了するまで待つ.
 */
export const waitUntilAuthenticated = async (): Promise<void> => {
  await flushPromises();
};
