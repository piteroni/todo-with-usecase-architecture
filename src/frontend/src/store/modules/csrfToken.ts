import { Mutations, Module } from "vuex-smart-module";

export class CsrfToken implements CsrfTokenState {
  public token = "";
}

export type CsrfTokenState = {
  token: string;
};

export class CsrfTokenMutations extends Mutations<CsrfTokenState> {
  /**
   * CSRFトークンを保存する.
   *
   * @param token CSRFトークン.
   */
  public save(token: string): void {
    this.state.token = token;
  }
}

export const csrfToken = new Module({
  state: CsrfToken,
  mutations: CsrfTokenMutations,
});

export type CsrfTokenContext = ReturnType<typeof csrfToken.context>;
