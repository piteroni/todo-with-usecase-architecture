import { injectable } from "inversify";
import { AxiosResponse } from "axios";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";
import { ApiError, UnauthorizedError } from "@/api/exceptions";
import { HttpStatusCode } from "@/shared/http";
import { PostLoginResponse } from "./types";

export const resource = "/identification";

@injectable()
export class Identification {
  /**
   * ユーザー認証を行う.
   *
   * @param email
   *   ユーザーのメールアドレス.
   * @param password
   *   ユーザーのパスワード.
   * @return
   *   API Token.
   * @throws {UnauthorizedError}
   *   認証に失敗した場合に送出される.
   * @throws {APIError}
   *   APIとの通信に失敗した場合に送出される.
   */
  public async login(email: string, password: string): Promise<PostLoginResponse> {
    const data = { email, password };

    let response: void | AxiosResponse<any>;

    try {
      response = await api.post(`${resource}/login`, data).catch(throwApiError);
    } catch (e) {
      if (e.constructor.name === ApiError.name) {
        const apiError = e as ApiError;

        if (apiError.statusCode === HttpStatusCode.UNAUTHORIZED) {
          throw new UnauthorizedError(apiError.message, apiError.statusCode, apiError.code);
        }
      }

      throw e;
    }

    return (response as AxiosResponse<PostLoginResponse>).data;
  }

  /**
   * システムからのログアウトを行う.
   *
   * @throws {APIError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async logout(): Promise<void> {
    await api.post(`${resource}/logout`).catch(throwApiError);
  }
}
