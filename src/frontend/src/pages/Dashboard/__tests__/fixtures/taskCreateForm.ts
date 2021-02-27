import { ApiError } from "@/api/exceptions";
import { TaskActions } from "@/store/modules/task";

export const createTaskMockWithException = jest.fn();

export class TaskActionsMockWithException extends TaskActions {
  public async createTask(_: string) {
    createTaskMockWithException(_);

    throw new ApiError("api-error");
  }
}
