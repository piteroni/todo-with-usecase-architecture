import { TaskActions } from "@/store/modules/task";

export const fetchTasksMock = jest.fn();

export const createTaskMock = jest.fn();

export const deleteTaskMock = jest.fn();

export class TaskActionsMock extends TaskActions {
  public async createTask(taskName: string) {
    createTaskMock(taskName);
  }

  public async fetchTasks() {
    fetchTasksMock();
  }

  public async deleteTask(taskId: number) {
    deleteTaskMock(taskId);
  }
}
