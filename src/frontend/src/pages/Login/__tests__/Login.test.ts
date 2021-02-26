import Vue from "vue";
import { Store } from "vuex";
import { createStore, Module } from "vuex-smart-module";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { apiToken, ApiTokenContext } from "@/store/modules/apiToken";
import Login from "@/pages/Login/Login.vue";
import { routes, waitUntilForMounted } from "./fixtures/shared";
import {
  ApiTokenActionsMockWithAuthFailure, ApiTokenActionsMockWithException, ApiTokenActionsMockWithAuthed, verifyCrediantialsMock
} from "./fixtures/login";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("Login.vue", () => {
  let vuetify = new Vuetify();
  let store: Store<unknown>;
  let context: ApiTokenContext;
  let apiTokenMock: typeof apiToken;
  let router: VueRouter;

  beforeAll(() => {
    apiTokenMock = apiToken.clone();
    apiTokenMock.options.actions = ApiTokenActionsMockWithAuthFailure;
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = createStore(new Module({ modules: { apiToken: apiTokenMock } }));
    context = apiTokenMock.context(store);
    router = new VueRouter({
      mode: "abstract",
      routes,
    });

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

    window.localStorage.clear();
  });

  afterEach(() => {
    verifyCrediantialsMock.mockReset();
  });

  it("初期画面表示時にローディング画面が表示される", async () => {
    const login = shallowMount(Login, {
      localVue,
      vuetify,
      router,
    });

    // mountedが完了すると、テストは失敗する.
    expect(login.find("loading-stub").exists()).toBeTruthy();
    expect(login.find("login-form-stub").exists()).toBeFalsy();
  });

  describe("ログインユーザーの資格情報検証処理", () => {
    it("ローカルストレージにAPIトークンが保存されていない場合に、ログインフォームが表示される", async () => {
      const login = shallowMount(Login, {
        localVue,
        vuetify,
        router,
      });

      await waitUntilForMounted();

      expect(verifyCrediantialsMock).not.toBeCalled();
      expect(login.find("login-form-stub").exists()).toBeTruthy();
    });

    it("ローカルストレージに保存されているAPIトークンが有効で無い場合に、ログインフォームが表示される", async () => {
      window.localStorage.setItem("api-token", "incorrect-token");

      const login = shallowMount(Login, {
        localVue,
        vuetify,
        router,
      });

      await waitUntilForMounted();

      expect(verifyCrediantialsMock).toBeCalled();
      expect(login.find("login-form-stub").exists()).toBeTruthy();
    });

    it("APIークンの検証処理中にUnauthorizedエラー以外が発生した場合に、エラーメッセージが通知される", async () => {
      const apiTokenStubWithException = apiToken.clone();
      apiTokenStubWithException.options.actions = ApiTokenActionsMockWithException;

      store = createStore(new Module({ modules: { apiToken: apiTokenStubWithException } }));
      context = apiTokenStubWithException.context(store);

      vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

      const stderrStub = jest.spyOn(console, "error");

      stderrStub.mockImplementation(input => input);

      const error = jest.fn();

      shallowMount(Login, {
        localVue,
        vuetify,
        router,
        mocks: {
          $notify: {
            error
          }
        }
      });

      await waitUntilForMounted();

      const stderrStubCalls = stderrStub.mock.calls;

      stderrStub.mockReset();
      stderrStub.mockRestore();

      expect(verifyCrediantialsMock).toBeCalled();
      expect(stderrStubCalls.length > 0).toBeTruthy();
      expect(stderrStubCalls[0][0]).not.toBe("");
      expect(error).toBeCalled();
      expect(error.mock.calls[0][0]).not.toBe("");
    });

    it("認証済みの場合に、ダッシュボード画面に推移する", async () => {
      const apiTokenStubWithAuthed = apiToken.clone();
      apiTokenStubWithAuthed.options.actions = ApiTokenActionsMockWithAuthed;

      store = createStore(new Module({ modules: { apiToken: apiTokenStubWithAuthed } }));
      context = apiTokenStubWithAuthed.context(store);

      vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

      const login = shallowMount(Login, {
        localVue,
        vuetify,
        router,
      });

      await waitUntilForMounted();

      expect(verifyCrediantialsMock).toBeCalled();
      expect("/dashboard").toBe(login.vm.$route.path);
    });
  });
});
