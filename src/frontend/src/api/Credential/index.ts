import { injectable } from "inversify";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";
import { HttpStatusCode } from "@/shared/http";
import { ApiError } from "@/api/exceptions";

export const resource = "/credentials";

/**
 * 未認証の場合のエラー.
 */
export class UnauthorizedError extends ApiError {
  public name = "UnauthorizedError";
}

@injectable()
export class Credential {
  /**
   * ログインユーザーの資格情報を検証する.
   *
   * @throws {ApiError}
   * @throws {UnauthorizedError}
   */
  public async verify(): Promise<void> {
    try {
      await api.post(`${resource}/verify`).catch(throwApiError);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.statusCode === HttpStatusCode.UNAUTHORIZED) {
          throw new UnauthorizedError(e.message, e.statusCode, e.code);
        }
      }

      throw e;
    }
  }
}
