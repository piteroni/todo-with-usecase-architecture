import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import { throwApiError } from "@/api/handlers";
import { api } from "@/api/base";
import { GetTasksResponse, TaskCreateResponse } from "./types";

export const resource = "/users";

@injectable()
export class User {
  /**
   * タスクの作成を行う.
   *
   * @param taskName
   *   タスク名.
   * @throws {APIError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async createTask(taskName: string): Promise<TaskCreateResponse> {
    const data = { taskName };

    const response = await api.post(`${resource}/current/tasks`, data).catch(throwApiError);

    return (response as AxiosResponse<TaskCreateResponse>).data;
  }

  /**
   * タスクのリストの取得を行う.
   *
   * @return
   *   タスクのリスト.
   * @throws {APIError}
   *   APIとの通信に失敗した場合に発生する.
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
   * @throws {APIError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async deleteTask(taskId: number): Promise<void> {
    await api.delete(`${resource}/current/tasks/${taskId}`).catch(throwApiError);
  }
}
