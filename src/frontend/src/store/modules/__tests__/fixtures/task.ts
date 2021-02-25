import { User } from "@/api/User";

export const createTaskMock = jest.fn();

export const getTasksMock = jest.fn();

export const deleteTaskMock = jest.fn();

export class UserMock extends User {
  public async createTask(taskName: string) {
    createTaskMock(taskName);

    return {
      id: 11,
      name: taskName
    };
  }

  public async getTasks() {
    getTasksMock();

    return [{ id: 8, name: "t" }, { id: 11, name: "s" }];
  }

  public async deleteTask(taskId: number) {
    deleteTaskMock(taskId);
  }
}
