import { injectable } from "inversify";
import { AxiosResponse } from "axios";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";
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
   * @throws {APIError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async login(email: string, password: string): Promise<PostLoginResponse> {
    const data = { email, password };

    const response = await api.post(`${resource}/login`, data).catch(throwApiError);

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
