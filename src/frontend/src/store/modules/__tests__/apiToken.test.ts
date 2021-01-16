import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { createStore } from "@/store/fixture";
import {
  apiToken, ApiTokenState, ApiTokenContext
} from "@/store/modules/apiToken";
import { container } from "@/providers/containers/api";
import { types } from "@/providers/types";
import { apiTokenKey } from "@/shared/localStorageKeys";
import { login, loginReturnValue } from "./fixtures/apiToken";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("apiToken.ts", () => {
  let store: Store<{ apiToken: ApiTokenState }>;
  let context: ApiTokenContext;

  beforeEach(() => {
    store = createStore({ apiToken });
    context = apiToken.context(store);

    container.rebind(types.api.Identification).toConstantValue({ login });

    window.localStorage.clear();
  });

  it("API Tokenをupdateメソッドに渡すと、Stateにトークンが保存される", () => {
    const token = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdF";

    context.mutations.update(token);

    expect(context.state.token).toBe(token);
    expect(store.state.apiToken.token).toBe(token);
  });

  it("localStorageにAPI Tokenを保存しsetUpTokenを呼び出すと、保存したトークンがStateに設定される", () => {
    const token = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdF";

    window.localStorage.setItem(apiTokenKey, token);

    context.actions.setUpToken();

    expect(context.state.token).toBe(token);
    expect(store.state.apiToken.token).toBe(token);
  });

  it("LocalStorageにAPI Tokenを保存せずsetUpTokenを呼び出すと、空文字がStateに設定される", () => {
    const emptyValue = "";

    context.actions.setUpToken();

    expect(context.state.token).toBe(emptyValue);
    expect(store.state.apiToken.token).toBe(emptyValue);
  });

  it("fetchメソッドを呼ぶと、サーバーから取得したAPI TokenがLocalStorageとStateに保存される", async () => {
    await context.actions.fetchApiToken({ email: "test@example.com", password: "password" });

    expect(context.state.token).toBe(loginReturnValue);
    expect(store.state.apiToken.token).toBe(loginReturnValue);
    expect(window.localStorage.getItem(apiTokenKey)).toBe(loginReturnValue);
  });

  it("StateににAPI Tokenを保存すると、isApiTokenStoredはstrueを返す", () => {
    context.mutations.update("token");

    expect(context.getters.isApiTokenStored).toBe(true);
  });

  it("StateににAPI Tokenを保存せず、isApiTokenStoredはtrueを返す", () => {
    expect(context.getters.isApiTokenStored).toBe(false);
  });
});
