import { Mutations, Module, Context } from "vuex-smart-module";

export class CsrfToken implements CsrfTokenState {
  public token = "";
}

export type CsrfTokenState = {
  token: string;
};

export class CsrfTokenMutations extends Mutations<CsrfTokenState> {
  /**
   * CSRFトークンを更新する.
   *
   * @param token CSRFトークン.
   */
  public update(token: string): void {
    this.state.token = token;
  }
}

export const csrfToken = new Module({
  state: CsrfToken,
  mutations: CsrfTokenMutations,
});

export type CsrfTokenContext = Context<Module<CsrfToken, any, CsrfTokenMutations, any, any>>;
