import Vue from "vue";
import { Store } from "vuex";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import { types } from "@/providers/types";
import { container as apiContainer } from "@/providers/containers/api";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { mount, createLocalVue } from "@vue/test-utils";
import { apiToken, ApiTokenContext, ApiTokenState } from "@/store/modules/apiToken";
import { createStore } from "@/store/fixture";
import Login from "@/pages/Login/Login.vue";
import { loginMock, router, waitUntilAuthenticated, waitUntilForMounted } from "./fixtures/login";

Vue.use(Vuetify);
Vue.use(VueRouter);

const localVue = createLocalVue();

describe("Dashboard.vue", () => {
  let vuetify = new Vuetify();
  let store: Store<{ apiToken: ApiTokenState }>;
  let context: ApiTokenContext;

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
