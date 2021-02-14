import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";
import { ApiError } from "@/api/exceptions";
import { HttpStatusCode } from "@/shared/http";
import { UnauthorizedError } from "./UnauthorizedError";
import { GetTasksResponse } from "./types";

export const resource = "/users";

@injectable()
export class User {
  /**
   * ログインユーザーの資格情報を検証する.
   *
   * @throws {ApiError}
   * @throws {UnauthorizedError}
   * @deprecated これはCredentialsに変えたいねー
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
   * @param taskName
   *   タスク名.
   */
  public async createTask(taskName: string): Promise<void> {
    const data = { taskName };

    await api.post(`${resource}/current/tasks`, data).catch(throwApiError);
  }

  /**
   * タスクのリストの取得を行う.
   *
   * @return
   *   タスクのリスト.
   */
  public async getTasks(): Promise<GetTasksResponse> {
    const response = await api.get(`${resource}/current/tasks`).catch(throwApiError);

    return (response as AxiosResponse<GetTasksResponse>).data;
  }

  /**
   * タスクの削除を行う.
   *
   * @param taskId
   *   削除対象のタスクのID.
   */
  public async deleteTask(taskId: number): Promise<void> {
    await api.delete(`${resource}/current/tasks/${taskId}`).catch(throwApiError);
  }
}
