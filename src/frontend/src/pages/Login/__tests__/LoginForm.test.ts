import Vue from "vue";
import { Store } from "vuex";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { apiToken, ApiTokenContext, ApiTokenState } from "@/store/modules/apiToken";
import LoginForm from "@/pages/Login/LoginForm.vue";
import {
  waitUntilAuthenticated, fetchApiTokenMock, fetchApiTokenMockWithAuthFailure, ApiTokenActionsMock, ApiTokenActionsMockWithAuthFailure
} from "./fixtures/loginForm";
import { routes, waitUntilForMounted } from "./fixtures/shared";
import { createStore, Module } from "vuex-smart-module";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("LoginForm.vue", () => {
  let vuetify = new Vuetify();
  let store: Store<{ apiToken: ApiTokenState }>;
  let context: ApiTokenContext;
  let apiTokenMock: typeof apiToken;
  let router: VueRouter;

  beforeAll(() => {
    apiTokenMock = apiToken.clone();
    apiTokenMock.options.actions = ApiTokenActionsMock;
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = createStore(new Module({ modules: { apiToken: apiTokenMock }}));
    context = apiTokenMock.context(store);
    router = new VueRouter({
      mode: "abstract",
      routes,
    });

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);
  });

  afterEach(() => {
    fetchApiTokenMock.mockReset();
    fetchApiTokenMockWithAuthFailure.mockReset();
    window.localStorage.clear();
  });

  it("ユーザー情報を送信すると、ログイン処理が呼び出される", async () => {
    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    await loginForm.find(".email input").setValue("user@example.com");
    await loginForm.find(".password input").setValue("password");
    await loginForm.find(".loginButton").trigger("click");

    await waitUntilAuthenticated();

    // 認証情報の保存処理が呼ばれること
    expect(fetchApiTokenMock).toBeCalled();

    // ダッシュボード画面に推移すること
    expect("/dashboard").toBe(loginForm.vm.$route.path);
  });

  it("認証に失敗すると、認証に失敗した旨が表示されログイン処理が中断される", async () => {
    const apiTokenMockWithAuthFailure = apiToken.clone();
    apiTokenMockWithAuthFailure.options.actions = ApiTokenActionsMockWithAuthFailure;

    store = createStore(new Module({ modules: { apiToken: apiTokenMockWithAuthFailure }}));
    context = apiTokenMockWithAuthFailure.context(store);

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    await loginForm.find(".email input").setValue("user@example.com");
    await loginForm.find(".password input").setValue("password");
    await loginForm.find(".loginButton").trigger("click");

    await waitUntilAuthenticated();

    // エラーメッセージが表示されていること
    expect(loginForm.find(".failureMessage").text()).not.toBe("");

    // ダッシュボード画面へ推移しないこと
    expect("/").toBe(loginForm.vm.$route.path);
  });

  it("資格情報の有効期限が超過しリダイレクトが実施された場合、資格情報の有効期限が超過した旨が表示される", async () => {
    router.push("/login?isRedirect=true");

    const loginForm = shallowMount(LoginForm, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    expect(loginForm.find(".redirectMessage").text()).not.toBe("");
  });

  it("認証情報を送信すると、URLのクエリが初期化され、資格情報の有効期限が超過した旨が表示されない", async () => {
    router.push("/login?isRedirect=true");

    // 画面が遷移しないようにあえて認証失敗させる
    const apiTokenMockWithAuthFailure = apiToken.clone();
    apiTokenMockWithAuthFailure.options.actions = ApiTokenActionsMockWithAuthFailure;

    store = createStore(new Module({ modules: { apiToken: apiTokenMockWithAuthFailure }}));
    context = apiTokenMockWithAuthFailure.context(store);

    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    await loginForm.find(".email input").setValue("user@example.com");
    await loginForm.find(".password input").setValue("password");
    await loginForm.find(".loginButton").trigger("click");

    await waitUntilAuthenticated();

    expect(loginForm.vm.$route.query).toEqual({});
    expect(loginForm.find(".redirectMessage").exists()).toBeFalsy();
  });

  it("入力欄に入力した値が制約に従わない場合、エラーメッセージが表示される", async () => {
    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    await loginForm.find(".email input").setValue("");
    await loginForm.find(".password input").setValue("");
    await loginForm.find(".loginButton").trigger("click");

    await waitUntilAuthenticated();

    // メールアドレス欄に空文字が入力された場合、エラーメッセージが表示されること
    expect(loginForm.find(".email div[role=\"alert\"] .v-messages__message").text()).not.toBe("");

    // パスワード欄に空文字が入力された場合、エラーメッセージが表示されること
    expect(loginForm.find(".password div[role=\"alert\"] .v-messages__message").text()).not.toBe("");
  });

  it("入力内容に不備がある場合、ログイン処理は実施されない", async () => {
    const loginForm = mount(LoginForm, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    await loginForm.find(".email input").setValue("");
    await loginForm.find(".password input").setValue("");
    await loginForm.find(".loginButton").trigger("click");

    // 認証情報の保存処理が呼ばれないこと
    expect(fetchApiTokenMock).not.toBeCalled();

    // ダッシュボード画面に推移しないこと
    expect("/").toBe(loginForm.vm.$route.path);
  });
});
