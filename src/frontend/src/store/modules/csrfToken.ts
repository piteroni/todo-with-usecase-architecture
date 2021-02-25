import { Mutations, Module } from "vuex-smart-module";

export interface CsrfTokenState {
  token: string;
}

class CsrfToken implements CsrfTokenState {
  public token = "";
}

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
