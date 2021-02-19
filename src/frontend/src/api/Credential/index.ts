import { injectable } from "inversify";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";

export const resource = "/credentials";

@injectable()
export class Credential {
  /**
   * ログインユーザーの資格情報を検証する.
   *
   * @throws {UnauthorizedError}
   *   ログインユーザーの資格情報が有効では無い場合にそ送出される.
   * @throws {ApiError}
   *   API通信時にエラーが発生した場合に送出される.
   */
  public async verify(): Promise<void> {
    await api.post(`${resource}/verify`).catch(throwApiError);
  }
}
