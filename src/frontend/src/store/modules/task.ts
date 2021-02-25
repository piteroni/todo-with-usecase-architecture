import {
  Mutations, Actions, Module, Context
} from "vuex-smart-module";
import { Api } from "@/providers/containers/api";
import { types } from "@/providers/types";
import { BG } from "vuex-smart-module/lib/assets";
import { User } from "@/api/User";

export type Task = {
  id: number;
  name: string;
};

export type TaskList = {
  tasks: Task[];
}

export class TaskState implements TaskList {
  public tasks: Task[] = [];
}

export class TaskMutations extends Mutations<TaskState> {
  /**
   * タスクリストを更新する.
   *
   * @param tasks タスクリスト.
   */
  public updateTasks(tasks: Task[]): void {
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
   * タスクの作成を行う.
   *
   * @param task
   *   作成するタスクに渡すパラメーター.
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
    this.state.tasks = await this.$user.getTasks();
  }

  /**
   * タスクの削除を行う.
   *
   * @param taskId
   *   削除対象のタスクのID.
   * @throws {ApiError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async deleteTask(taskId: number): Promise<void> {
    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);

    await this.$user.deleteTask(taskId);
  }
}

export const task = new Module({
  state: TaskState,
  mutations: TaskMutations,
  actions: TaskActions
});

export type TaskContext = Context<Module<TaskState, BG<TaskState>, TaskMutations, TaskActions, any>>;
