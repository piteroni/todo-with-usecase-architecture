import Vue from "vue";
import Vuetify from "vuetify";
import VueRouter, { RouteConfig } from "vue-router";
import { mount, createLocalVue } from "@vue/test-utils";
import Login from "@/pages/Login/Login.vue";
import { apiToken, ApiTokenContext, ApiTokenState } from "@/store/modules/apiToken";
import { Store } from "vuex";
import { createStore } from "@/store/fixture";
import { PostLoginResponse } from "@/api/Identification/types";
import { container as apiContainer } from "@/providers/containers/api";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { types } from "@/providers/types";
import flushPromises from "flush-promises";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("Dashboard.vue", () => {
  let vuetify = new Vuetify();
  let store: Store<{ apiToken: ApiTokenState }>;
  let context: ApiTokenContext;

  const routes: Array<RouteConfig> = [
    {
      path: "/dashboard",
      name: "dashboard",
      component: { template: "<div></div>" }
    }
  ];

  const router = new VueRouter({
    mode: "history",
    routes,
  });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = createStore({ apiToken });
    context = apiToken.context(store);

    apiContainer.rebind(types.api.Identification).toConstantValue({ login: loginMock });
    vuexContextContainer.rebind(types.vuexContexts.apiToken).toConstantValue(context);

    window.localStorage.clear();
  });

  it("メールアドレスとパスワードを入力し、ログインボタンを押下するとログイン処理が呼び出される", async () => {
    const login = mount(Login, {
      localVue,
      vuetify,
      router,
    });

    await waitUntilForMounted();

    await login.find(".email input").setValue("user@example.com");
    await login.find(".password input").setValue("password");
    await login.find(".loginButton").trigger("click");

    await waitUntilAuthenticated();

    expect("/dashboard").toBe(login.vm.$route.path);
  });
});

const loginReturnValue = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdO";

const loginMock = async (): Promise<PostLoginResponse> => ({
  apiToken: loginReturnValue
});

export const waitUntilForMounted = async (): Promise<void> => {
  await flushPromises();
}

export const waitUntilAuthenticated = async (): Promise<void> => {
  await flushPromises();
}
