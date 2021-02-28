import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { createLocalVue, mount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { task, TaskContext } from "@/store/modules/task";
import { createStore, Module } from "vuex-smart-module";
import TaskList from "@/pages/Dashboard/TaskList.vue";
import { waitUntilForDone, waitUntilForMounted } from "@/shared/fixture";
import { deleteTaskMock, TaskActionsMock } from "./fixtures/shared";
import { deleteTaskMockMockWithException, TaskActionsMockWithException } from "./fixtures/taskList";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("TaskList.vue", () => {
  let vuetify = new Vuetify();
  let context: TaskContext;
  let taskMock: typeof task;

  beforeAll(() => {
    taskMock = task.clone();
    taskMock.options.actions = TaskActionsMock;
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    const store = createStore(new Module({ modules: { task: taskMock } }));
    context = taskMock.context(store);

    vuexContextContainer.rebind(types.vuexContexts.task).toConstantValue(context);
  });

  afterEach(() => {
    deleteTaskMock.mockReset();
  });

  it("Vuexに保存したタスクのタスク名がリストで表示される", async () => {
    context.mutations.save([{ id: 2, name: "task-0" }, { id: 3, name: "task-1" }]);

    const taskList = mount(TaskList, {
      localVue,
      vuetify,
    });

    await waitUntilForMounted();

    const actual = taskList.findAll(".taskList .task");

    expect(actual.length).toBe(2);
    expect(actual.wrappers[0].text()).toBe("task-0");
    expect(actual.wrappers[1].text()).toBe("task-1");
  });

  it("タスク削除ボタンを押下すると、当該のタスクの削除処理が呼ばれる", async () => {
    context.mutations.save([{ id: 2, name: "task-0" }]);

    const taskList = mount(TaskList, {
      localVue,
      vuetify,
    });

    await waitUntilForMounted();

    await taskList.find(".taskList .task .deleteButton").trigger("click");

    expect(deleteTaskMock).toBeCalledWith(2);
  });

  describe("API例外ハンドリング", () => {
    let stderrMock: jest.SpyInstance;
    let errorNotifyMock: jest.Mock;
    let $notify: Record<string, jest.Mock>;

    beforeEach(() => {
      const taskMockWithExcetion = task.clone();
      taskMockWithExcetion.options.actions = TaskActionsMockWithException;

      const store = createStore(new Module({ modules: { task: taskMockWithExcetion } }));
      context = taskMockWithExcetion.context(store);

      vuexContextContainer.rebind(types.vuexContexts.task).toConstantValue(context);

      stderrMock = jest.spyOn(console, "error");
      stderrMock.mockImplementation(input => input);

      errorNotifyMock = jest.fn();
      $notify = {
        error: errorNotifyMock
      };
    });

    afterEach(() => {
      errorNotifyMock.mockReset();
      deleteTaskMockMockWithException.mockReset();
      stderrMock.mockReset();
      stderrMock.mockRestore();
    });

    it("タスクの削除処理中に例外が発生した場合、エラーメッセージが表示される", async () => {
      context.mutations.save([{ id: 2, name: "task-0" }]);

      const taskList = mount(TaskList, {
        localVue,
        vuetify,
        mocks: { $notify }
      });

      await waitUntilForMounted();

      await taskList.find(".taskList .task .deleteButton").trigger("click");

      await waitUntilForDone();

      expect(deleteTaskMockMockWithException).toBeCalledWith(2);
      expect(stderrMock).toBeCalled();
      expect(stderrMock.mock.calls[0][0]).not.toBe("");
      expect(errorNotifyMock).toBeCalled();
      expect(errorNotifyMock.mock.calls[0][0]).not.toBe("");
    });
  });
});
