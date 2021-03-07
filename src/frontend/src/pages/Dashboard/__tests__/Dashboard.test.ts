import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { apiToken } from "@/store/modules/apiToken";
import { task } from "@/store/modules/task";
import { createStore, Module } from "vuex-smart-module";
import Dashboard from "@/pages/Dashboard/Dashboard.vue";
import { waitUntilForMounted } from "@/shared/fixture";
import { fetchTasksMock, TaskActionsMock } from "./fixtures/shared";
import {
  verifyCrediantialsMock, ApiTokenActionsMockWithAuthed, ApiTokenGettersMockWithAuthed, ApiTokenGettersMockWithUnauthed, ApiTokenActionsMockWithAuthFailure, ApiTokenActionsMockWithException, TaskActionsMockWithException, fetchTasksMockWithException
} from "./fixtures/dashboard";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("Dashboard.vue", () => {
  let vuetify = new Vuetify();
  let apiTokenMock: typeof apiToken;
  let taskMock: typeof task;
  let router: VueRouter;

  beforeAll(() => {
    apiTokenMock = apiToken.clone();
    apiTokenMock.options.getters = ApiTokenGettersMockWithAuthed;
    apiTokenMock.options.actions = ApiTokenActionsMockWithAuthed;
    taskMock = task.clone();
    taskMock.options.actions = TaskActionsMock;
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    router = new VueRouter({
      mode: "abstract",
      routes: [
        {
          name: "login",
          path: "/login",
        }
      ]
    });

    const store = createStore(new Module({
      modules: {
        apiToken: apiTokenMock,
        task: taskMock
      }
    }));
    const apiTokenContext = apiTokenMock.context(store);
    const taskContext = taskMock.context(store);

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(apiTokenContext);
    vuexContextContainer.rebind(types.vuexContexts.task).toConstantValue(taskContext);
  });

  afterEach(() => {
    fetchTasksMock.mockReset();
    verifyCrediantialsMock.mockReset();
  });

  it("初期画面表示時にローディング画面が表示される", async () => {
    const dashboard = shallowMount(Dashboard, {
      localVue,
      vuetify,
      router,
    });

    // mountedが完了すると、テストは失敗する.
    expect(dashboard.find("loading-stub").exists()).toBeTruthy();
    expect(dashboard.find("login-form-stub").exists()).toBeFalsy();
  });

  it("ユーザーの資格情報が有効であるかつ、タスクの取得処理が完了すると、ダッシュボード画面が表示される", async () => {
    const dashboard = shallowMount(Dashboard, {
      localVue,
      vuetify,
      router
    });

    await waitUntilForMounted();

    expect(fetchTasksMock).toBeCalled();
    expect(dashboard.find("loading-stub").exists()).toBeFalsy();
    expect(dashboard.find(".dashboard").exists()).toBeTruthy();
  });

  describe("API例外ハントリング", () => {
    let stderrMock: jest.SpyInstance;
    let errorNotifyMock: jest.Mock;
    let $notify: Record<string, jest.Mock>;

    beforeEach(() => {
      stderrMock = jest.spyOn(console, "error");
      stderrMock.mockImplementation(input => input);

      errorNotifyMock = jest.fn();
      $notify = {
        error: errorNotifyMock
      };
    });

    afterEach(() => {
      fetchTasksMockWithException.mockReset();
      errorNotifyMock.mockReset();
      stderrMock.mockReset();
      stderrMock.mockRestore();
    });

    it("タスク取得処理中に例外が発生した場合に、エラーメッセージが通知される", async () => {
      const taskMockWithExcetion = task.clone();
      taskMockWithExcetion.options.actions = TaskActionsMockWithException;

      const store = createStore(new Module({
        modules: {
          apiToken: apiTokenMock,
          task: taskMockWithExcetion
        }
      }));
      const taskContext = taskMockWithExcetion.context(store);

      vuexContextContainer.rebind(types.vuexContexts.task).toConstantValue(taskContext);

      shallowMount(Dashboard, {
        localVue,
        vuetify,
        router,
        mocks: { $notify }
      });

      await waitUntilForMounted();

      expect(fetchTasksMockWithException).toBeCalled();
      expect(stderrMock).toBeCalled();
      expect(stderrMock.mock.calls[0][0]).not.toBe("");
      expect(errorNotifyMock).toBeCalled();
      expect(errorNotifyMock.mock.calls[0][0]).not.toBe("");
    });
  });

  describe("ログインユーザーの資格情報検証処理", () => {
    it("ローカルストレージにAPIトークンが保存されていない場合に、ログイン画面にリダイレクトされる", async () => {
      const apiTokenMockWithUnauthed = apiToken.clone();
      apiTokenMockWithUnauthed.options.getters = ApiTokenGettersMockWithUnauthed;

      const store = createStore(new Module({
        modules: {
          apiToken: apiTokenMockWithUnauthed,
          task: taskMock
        }
      }));
      const apiTokenContext = apiTokenMockWithUnauthed.context(store);

      vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(apiTokenContext);

      const dashboard = shallowMount(Dashboard, {
        localVue,
        vuetify,
        router,
      });

      await waitUntilForMounted();

      expect(dashboard.vm.$route.name).toBe("login");
    });

    it("ローカルストレージに保存されているトークンが有効で無い場合に、ログイン画面にリダイレクトされる", async () => {
      const apiTokenMockWithAuthFailure = apiToken.clone();
      apiTokenMockWithAuthFailure.options.getters = ApiTokenGettersMockWithAuthed;
      apiTokenMockWithAuthFailure.options.actions = ApiTokenActionsMockWithAuthFailure;

      const store = createStore(new Module({
        modules: {
          apiToken: apiTokenMockWithAuthFailure,
          task: taskMock
        }
      }));
      const apiTokenContext = apiTokenMockWithAuthFailure.context(store);

      vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(apiTokenContext);

      const dashboard = shallowMount(Dashboard, {
        localVue,
        vuetify,
        router,
      });

      await waitUntilForMounted();

      expect(verifyCrediantialsMock).toBeCalled();
      expect(dashboard.vm.$route.name).toBe("login");
    });

    describe("API例外ハントリング", () => {
      let stderrMock: jest.SpyInstance;
      let errorNotifyMock: jest.Mock;
      let $notify: Record<string, jest.Mock>;

      beforeEach(() => {
        stderrMock = jest.spyOn(console, "error");
        stderrMock.mockImplementation(input => input);

        errorNotifyMock = jest.fn();
        $notify = {
          error: errorNotifyMock
        };
      });

      afterEach(() => {
        errorNotifyMock.mockReset();
        stderrMock.mockReset();
        stderrMock.mockRestore();
      });

      it("APIトークンの検証処理中に例外が発生した場合に、エラーメッセージが通知される", async () => {
        const apiTokenMockWithAuthFailure = apiToken.clone();
        apiTokenMockWithAuthFailure.options.getters = ApiTokenGettersMockWithAuthed;
        apiTokenMockWithAuthFailure.options.actions = ApiTokenActionsMockWithException;

        const store = createStore(new Module({
          modules: {
            apiToken: apiTokenMockWithAuthFailure,
            task: taskMock
          }
        }));
        const apiTokenContext = apiTokenMockWithAuthFailure.context(store);

        vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(apiTokenContext);

        shallowMount(Dashboard, {
          localVue,
          vuetify,
          router,
          mocks: { $notify }
        });

        await waitUntilForMounted();

        expect(verifyCrediantialsMock).toBeCalled();
        expect(stderrMock).toBeCalled();
        expect(stderrMock.mock.calls[0][0]).not.toBe("");
        expect(errorNotifyMock).toBeCalled();
        expect(errorNotifyMock.mock.calls[0][0]).not.toBe("");
      });
    });
  });
});
