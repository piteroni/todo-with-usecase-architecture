import { injectable } from "inversify";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";
import { ApiError } from "@/api/exceptions";
import { HttpStatusCode } from "@/shared/http";
import { UnauthorizedError } from "./UnauthorizedError";

export const resource = "/users";

@injectable()
export class User {
  /**
   * ログインユーザーの資格情報を検証する.
   *
   * @throws {ApiError}
   * @throws {UnauthorizedError}
   */
  public async verifyCrediantials(): Promise<void> {
    try {
      await api.get(`${resource}/current/credentials/verify`).catch(throwApiError);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.statusCode === HttpStatusCode.UNAUTHORIZED) {
          throw new UnauthorizedError(e.message, e.statusCode, e.code);
        }
      }

      throw e;
    }
  }

  /**
   * タスクの作成を行う.
   *
   * @param task
   */
  public async createTask(taskName: string): Promise<void> {
    const data = { taskName };

    await api.post(`${resource}/current/tasks`, data).catch(throwApiError);
  }
}
