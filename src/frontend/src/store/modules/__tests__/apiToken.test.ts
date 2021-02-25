import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { createStore } from "@/store/fixture";
import {
  apiToken, ApiTokenState, ApiTokenContext
} from "@/store/modules/apiToken";
import { container } from "@/providers/containers/api";
import { types } from "@/providers/types";
import { apiTokenKey } from "@/shared/localStorageKeys";
import { login } from "./fixtures/apiToken";

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

  describe("getters", () => {
    it("stateにAPIトークンが保存されているか否かを取得できる", () => {
      context.state.token = "token";

      expect(context.getters.isApiTokenStored).toBe(true);
    });

    it("stateにAPIトークンが保存されていない場合、真偽値falseを返す", () => {
      expect(context.getters.isApiTokenStored).toBe(false);
    });
  });

  describe("mutations", () => {
    it("stateにAPIトークンを保存できる", () => {
      const token = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdF";

      context.mutations.save(token);

      expect(context.state.token).toBe(token);
      expect(store.state.apiToken.token).toBe(token);
    });
  });

  describe("actions", () => {
    it("LocalStorageに保存したAPIトークンをstateに設定できる", () => {
      const token = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdF";

      window.localStorage.setItem(apiTokenKey, token);

      context.actions.setUpToken();

      expect(context.state.token).toBe(token);
      expect(store.state.apiToken.token).toBe(token);
    });

    it("LocalStorageにAPIトークンが保存されていない場合、空文字がstateに設定される", () => {
      const expected = "";

      window.localStorage.clear();

      context.actions.setUpToken();

      expect(context.state.token).toBe(expected);
      expect(store.state.apiToken.token).toBe(expected);
    });

    it("認証APIを通じてサーバーから取得したAPIトークンをLocalStorageとstateに保存できる", async () => {
      const expected = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdO";

      await context.actions.fetchApiToken({ email: "test@example.com", password: "password" });

      expect(window.localStorage.getItem(apiTokenKey)).toBe(expected);
      expect(context.state.token).toBe(expected);
      expect(store.state.apiToken.token).toBe(expected);
    });
  });
});
