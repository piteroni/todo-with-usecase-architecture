import Vuex, { Store } from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { createStore } from "@/store/fixture";
import { csrfToken, CsrfTokenState, CsrfTokenContext } from "@/store/modules/csrfToken";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("csrfToken.ts", () => {
  let store: Store<{ csrfToken: CsrfTokenState }>;
  let context: CsrfTokenContext;

  beforeEach(() => {
    store = createStore({ csrfToken });
    context = csrfToken.context(store);
  });

  it("CSRFトークンを保存することができる", () => {
    const token = "rFUTKkeOUUvpD6cuUxUoKHsjdpP7P65LtuFLYVqb";

    context.mutations.save(token);

    expect(context.state.token).toBe(token);
    expect(store.state.csrfToken.token).toBe(token);
  });
});
