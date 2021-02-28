import { ApiError } from "@/api/exceptions";
import { TaskActions } from "@/store/modules/task";

export const deleteTaskMockMockWithException = jest.fn();

export class TaskActionsMockWithException extends TaskActions {
  public async deleteTask(_: number) {
    deleteTaskMockMockWithException(_);

    throw new ApiError("api-error");
  }
}
