import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { createLocalVue, mount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { task } from "@/store/modules/task";
import { createStore, Module } from "vuex-smart-module";
import TaskCreateForm from "@/pages/Dashboard/TaskCreateForm.vue";
import { waitUntilForDone, waitUntilForMounted } from "@/shared/fixture";
import { createTaskMock, TaskActionsMock } from "./fixtures/shared";
import { createTaskMockWithException, TaskActionsMockWithException } from "./fixtures/taskCreateForm";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("taskCreateForm.vue", () => {
  let vuetify = new Vuetify();
  let taskMock: typeof task;

  beforeAll(() => {
    taskMock = task.clone();
    taskMock.options.actions = TaskActionsMock;
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    const store = createStore(new Module({ modules: { task: taskMock } }));
    const context = taskMock.context(store);

    vuexContextContainer.rebind(types.vuexContexts.task).toConstantValue(context);
  });

  afterEach(() => {
    createTaskMock.mockReset();
    createTaskMockWithException.mockReset();
  });

  it("タスク情報を送信すると、タスク作成処理が呼ばれ、入力フォームの値が初期化される", async () => {
    const taskCreateForm = mount(TaskCreateForm, {
      localVue,
      vuetify,
    });

    await waitUntilForMounted();

    await taskCreateForm.find(".taskInput input").setValue("new-task");
    await taskCreateForm.find(".taskCreateButton").trigger("click");

    await waitUntilForDone();

    expect(createTaskMock).toBeCalledWith("new-task");
    expect((taskCreateForm.find(".taskInput input").element as HTMLInputElement).value).toBe("");
  });

  it("入力内容に不備がある場合、エラーメッセージが表示され、タスク作成処理は実施されない", async () => {
    const taskCreateForm = mount(TaskCreateForm, {
      localVue,
      vuetify,
    });

    await waitUntilForMounted();

    await taskCreateForm.find(".taskInput input").setValue("");
    await taskCreateForm.find(".taskCreateButton").trigger("click");

    await waitUntilForDone();

    expect(taskCreateForm.find(".taskInput .v-messages__message").text()).not.toBe("");
    expect(createTaskMock).not.toBeCalled();
  });

  describe("API例外ハンドリング", () => {
    let stderrStub: jest.SpyInstance;
    let errorNotify: jest.Mock;
    let $notify: Record<string, jest.Mock>;

    beforeEach(() => {
      const taskMockWithExcetion = task.clone();
      taskMockWithExcetion.options.actions = TaskActionsMockWithException;

      const store = createStore(new Module({ modules: { task: taskMockWithExcetion } }));
      const context = taskMockWithExcetion.context(store);

      vuexContextContainer.rebind(types.vuexContexts.task).toConstantValue(context);

      stderrStub = jest.spyOn(console, "error");

      stderrStub.mockImplementation(input => input);

      errorNotify = jest.fn();

      $notify = {
        error: errorNotify
      };
    });

    afterEach(() => {
      errorNotify.mockReset();
      stderrStub.mockReset();
      stderrStub.mockRestore();
    });

    it("タスク作成処理中に例外が発生した場合、エラーメッセージが表示される", async () => {
      const taskCreateForm = mount(TaskCreateForm, {
        localVue,
        vuetify,
        mocks: { $notify }
      });

      await waitUntilForMounted();

      await taskCreateForm.find(".taskInput input").setValue("new-task");
      await taskCreateForm.find(".taskCreateButton").trigger("click");

      await waitUntilForDone();

      expect(createTaskMock).not.toBeCalled();
      expect(stderrStub).toBeCalled();
      expect(stderrStub.mock.calls[0][0]).not.toBe("");
      expect(errorNotify).toBeCalled();
      expect(errorNotify.mock.calls[0][0]).not.toBe("");
    });
  });
});
