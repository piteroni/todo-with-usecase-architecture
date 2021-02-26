import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { createStore } from "@/store/fixture";
import {
  task, Task, TaskContext, TaskState
} from "@/store/modules/task";
import { types } from "@/providers/types";
import { container } from "@/providers/containers/api";
import { User } from "@/api/User";
import {
  getTasksMock, createTaskMock, deleteTaskMock, UserMock
} from "./fixtures/task";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("task.ts", () => {
  let store: Store<{ task: TaskState }>;
  let context: TaskContext;

  beforeEach(() => {
    store = createStore({ task });
    context = task.context(store);
  });

  describe("mutations", () => {
    it("タスクリストをstateに保存できる", () => {
      const tasks: Task[] = [{ id: 1, name: "t" }];

      context.mutations.save(tasks);

      expect(context.state.tasks).toEqual(tasks);
      expect(store.state.task.tasks).toEqual(tasks);
    });

    it("タスクをstateに追加できる", () => {
      const task = { id: 2, name: "n" };
      const expected = [{ id: 1, name: "t" }, { id: 2, name: "n" }];

      // 事前状態を表現
      context.state.tasks = [{ id: 1, name: "t" }];
      context.mutations.addTask(task);

      expect(context.state.tasks).toEqual(expected);
      expect(store.state.task.tasks).toEqual(expected);
    });
  });

  describe("actions", () => {
    beforeAll(() => {
      container.rebind<User>(types.api.User).to(UserMock);
    });

    afterEach(() => {
      createTaskMock.mockReset();
      getTasksMock.mockReset();
      deleteTaskMock.mockReset();
    });

    it("タスクの作成リクエストを発行し、返ってきたタスクオブジェクトをstateに保存できる", async () => {
      const expected = [{ id: 1, name: "t" }, { id: 11, name: "at" }];

      // 事前状態を表現
      context.state.tasks = [{ id: 1, name: "t" }];

      await context.actions.createTask("at");

      expect(createTaskMock).toBeCalledWith("at");
      expect(context.state.tasks).toEqual(expected);
      expect(store.state.task.tasks).toEqual(expected);
    });

    it("タスクリスト取得リクエストを発行し、返ってきたタスクリストをstateに保存できる", async () => {
      const expected = [{ id: 8, name: "t" }, { id: 11, name: "s" }];

      await context.actions.fetchTasks();

      expect(getTasksMock).toBeCalled();
      expect(context.state.tasks).toEqual(expected);
      expect(store.state.task.tasks).toEqual(expected);
    });

    it("削除したいタスクのIDを渡すと、タスク削除リクエストを発行し、IDに一致するタスクをstateから削除できる", async () => {
      const expected = [{ id: 19, name: "t" }];

      // 事前状態を表現
      context.state.tasks = [{ id: 19, name: "t" }, { id: 21, name: "s" }];

      await context.actions.deleteTask(21);

      expect(deleteTaskMock).toBeCalledWith(21);
      expect(context.state.tasks).toEqual(expected);
      expect(store.state.task.tasks).toEqual(expected);
    });
  });
});
