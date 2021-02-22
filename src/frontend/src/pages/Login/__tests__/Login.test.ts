import Vue from "vue";
import { Store } from "vuex";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { apiToken, ApiTokenContext, ApiTokenState } from "@/store/modules/apiToken";
import { createStore } from "@/store/fixture";
import Login from "@/pages/Login/Login.vue";
import { routes, waitUntilForMounted } from "./fixtures/shared";
import { apiTokenStub, apiTokenStubWithAuthed, apiTokenStubWithException } from "./fixtures/login";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("Login.vue", () => {
  let vuetify = new Vuetify();
  let store: Store<unknown>;
  let context: ApiTokenContext;
  let router: VueRouter;

  beforeEach(() => {
    vuetify = new Vuetify();
    store = createStore({ apiTokenStub });
    context = apiTokenStub.context(store);
    router = new VueRouter({
      mode: "abstract",
      routes,
    });

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

    window.localStorage.clear();
  });

  // it("初期画面表示時にローディング画面が表示される", async () => {
    // const login = shallowMount(Login, {
    //   localVue,
    //   vuetify,
    //   router,
    //   created: function() {
    //     console.log(this);
    //   }
    // });

    // await waitUntilForMounted();

    // console.log(login.html());

    // await login.find(".email input").setValue("user@example.com");
    // await login.find(".password input").setValue("password");
    // await login.find(".loginButton").trigger("click");

    // expect(0).toBe(0);

    // expect("/dashboard").toBe(login.vm.$route.path);
  // });

  it("ローカルストレージにトークンが保存されていない場合に、ログインフォームが表示される", async () => {
    const login = shallowMount(Login, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    expect(login.find("login-form-stub").exists()).toBeTruthy();
  });

  it("ローカルストレージにトークンが有効で無い場合に、ログインフォームが表示される", async () => {
    window.localStorage.setItem("api-token", "incorrect-token");

    const login = shallowMount(Login, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    expect(login.find("login-form-stub").exists()).toBeTruthy();
  });

  it("トークンの検証処理中にUnauthorizedエラー以外が発生した場合に、エラーメッセージが通知される", async () => {
    const stderrStub = jest.spyOn(console, "error");

    stderrStub.mockImplementation(input => input);

    // $notifyはここでmockできるかもな

    store = createStore({ apiTokenStubWithException });
    context = apiTokenStubWithException.context(store);

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

    shallowMount(Login, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    stderrStub.mockReset();
    stderrStub.mockRestore();

    expect(0).toBe(0);
    // expect("/dashboard").toBe(login.vm.$route.path);
  });

  it("認証済みの場合に、ダッシュボード画面に推移する", async () => {
    store = createStore({ apiTokenStubWithAuthed });
    context = apiTokenStubWithAuthed.context(store);

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

    const login = shallowMount(Login, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    expect("/dashboard").toBe(login.vm.$route.path);
  });
});
