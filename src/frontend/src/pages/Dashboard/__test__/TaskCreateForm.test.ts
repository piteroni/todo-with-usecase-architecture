import Vue from "vue";
import { Store } from "vuex";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { task, TaskContext } from "@/store/modules/task";
import { createStore, Module } from "vuex-smart-module";
// import { createStore } from "@/store/fixture";
import TaskCreareForm from "@/pages/Dashboard/TaskCreareForm.vue";
import { createTaskMock, TaskActionsMock } from "./fixtures/shared";
import { waitUntilForMounted } from "@/shared/fixture";
// import { routes, waitUntilForMounted } from "./fixtures/shared";
// import { apiTokenStub, apiTokenStubWithAuthed, apiTokenStubWithException } from "./fixtures/login";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("TaskCreateForm.vue", () => {
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

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);
  });

  afterEach(() => {
    createTaskMock.mockReset();
  });

  it("タスク情報を送信すると、タスク作成処理が呼ばれ、入力フォームの値が初期化される", async () => {
    const taskCreareForm = shallowMount(TaskCreareForm, {
      localVue,
      vuetify,
    });

    await waitUntilForMounted();

    await taskCreareForm.find(".taskInput input").setValue("new-task");
    await taskCreareForm.find(".taskCreateButton").trigger("click");

    console.log(taskCreareForm.find(".taskInput input").attributes());

    // const inputValue = taskCreareForm.find(".taskInput input").attributes

    expect(createTaskMock).toBeCalledWith();
  });

//   it("ローカルストレージにトークンが保存されていない場合に、ログインフォームが表示される", async () => {
//     const login = shallowMount(Login, {
//       localVue,
//       vuetify,
//       router,
//     });

//     await waitUntilForMounted();

//     expect(login.find("login-form-stub").exists()).toBeTruthy();
//   });

//   it("ローカルストレージ保存されているトークンが有効で無い場合に、ログインフォームが表示される", async () => {
//     window.localStorage.setItem("api-token", "incorrect-token");

//     const login = shallowMount(Login, {
//       localVue,
//       vuetify,
//       router,
//     });

//     await waitUntilForMounted();

//     expect(login.find("login-form-stub").exists()).toBeTruthy();
//   });

//   it("トークンの検証処理中にUnauthorizedエラー以外が発生した場合に、エラーメッセージが通知される", async () => {
//     store = createStore({ apiTokenStubWithException });
//     context = apiTokenStubWithException.context(store);

//     vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

//     // 実装にconsole.errorに例外を出力する箇所があるので、テストランナーに表示させないようにする
//     const stderrStub = jest.spyOn(console, "error");

//     stderrStub.mockImplementation(input => input);

//     const error = jest.fn();

//     shallowMount(Login, {
//       localVue,
//       vuetify,
//       router,
//       mocks: {
//         $notify: {
//           error
//         }
//       }
//     });

//     await waitUntilForMounted();

//     stderrStub.mockReset();
//     stderrStub.mockRestore();

//     expect(error).toBeCalled();
//     // エラー通知メソッドにメッセージが渡されること
//     expect(error.mock.calls[0][0]).not.toBe("");
//   });

//   it("認証済みの場合に、ダッシュボード画面に推移する", async () => {
//     store = createStore({ apiTokenStubWithAuthed });
//     context = apiTokenStubWithAuthed.context(store);

//     vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

//     const login = shallowMount(Login, {
//       localVue,
//       vuetify,
//       router,
//     });

//     await waitUntilForMounted();

//     expect("/dashboard").toBe(login.vm.$route.path);
//   });
});
