import {
  Mutations, Actions, Module
} from "vuex-smart-module";
import { BG } from "vuex-smart-module/lib/assets";
import { types } from "@/providers/types";
import { Api } from "@/providers/containers/api";
import { User } from "@/api/User";

export interface Task {
  id: number;
  name: string;
}

export interface TaskState {
  tasks: Task[];
}

class TaskStateImpl implements TaskState {
  public tasks: Task[] = [];
}

export class TaskMutations extends Mutations<TaskState> {
  /**
   * タスクリストを保存する.
   *
   * @param tasks タスクリスト.
   */
  public save(tasks: Task[]): void {
    this.state.tasks = tasks;
  }

  /**
   * タスクを追加する.
   *
   * @param task 追加対象のタスク.
   */
  public addTask(task: Task): void {
    this.state.tasks.push(task);
  }
}

export class TaskActions extends Actions<TaskState, BG<TaskState>, TaskMutations, TaskActions> {
  @Api(types.api.User)
  private $user!: User;

  /**
   * サーバーにタスク作成リクエストを発行し、返ってきたタスクをローカルに追加する.
   *
   * @param taskName
   *   作成するタスクのタスク名.
   * @throws {ApiError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async createTask(taskName: string): Promise<void> {
    const createdTask = await this.$user.createTask(taskName);

    this.mutations.addTask(createdTask);
  }

  /**
   * サーバーからタスクリストを取得し、ローカルに保存する.
   *
   * @throws {ApiError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async fetchTasks(): Promise<void> {
    const tasks = await this.$user.getTasks();

    this.mutations.save(tasks);
  }

  /**
   * 指定されたタスクのIDに一致するタスクを削除し、サーバーにタスク削除リクエストを発行する.
   *
   * @param taskId
   *   削除対象のタスクのID.
   * @throws {ApiError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async deleteTask(taskId: number): Promise<void> {
    const tasks = this.state.tasks.filter(t => t.id !== taskId);

    this.mutations.save(tasks);

    await this.$user.deleteTask(taskId);
  }
}

export const task = new Module({
  state: TaskStateImpl,
  mutations: TaskMutations,
  actions: TaskActions
});

export type TaskContext = ReturnType<typeof task.context>;
