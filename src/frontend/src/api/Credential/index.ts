import { injectable } from "inversify";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";
import { HttpStatusCode } from "@/shared/http";
import { ApiError, UnauthorizedError } from "../exceptions";

export const resource = "/credentials";

@injectable()
export class Credential {
  /**
   * ログインユーザーの資格情報を検証する.
   *
   * @throws {UnauthorizedError}
   *   ログインユーザーの資格情報が有効では無い場合に送出される.
   * @throws {ApiError}
   *   API通信時にエラーが発生した場合に送出される.
   */
  public async verify(): Promise<void> {
    try {
      await api.post(`${resource}/verify`).catch(throwApiError);
    } catch (e) {
      if (e.constructor.name === ApiError.name) {
        const apiError = e as ApiError;

        if (apiError.statusCode === HttpStatusCode.UNAUTHORIZED) {
          throw new UnauthorizedError(apiError.message, apiError.statusCode, apiError.code);
        }
      }

      throw e;
    }
  }
}
