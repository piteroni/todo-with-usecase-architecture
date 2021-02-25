import {
  Mutations, Getters, Actions, Module
} from "vuex-smart-module";
import { Api } from "@/providers/containers/api";
import { types } from "@/providers/types";
import { Identification } from "@/api/Identification";
import { apiTokenKey } from "@/shared/localStorageKeys";
import { Credential } from "@/api/Credential";

export interface ApiTokenState {
  token: string;
}

class ApiToken implements ApiTokenState {
  public token = "";
}

export class ApiTokenGetters extends Getters<ApiTokenState> {
  /**
   * API Tokenが保存されているか取得する.
   *
   * @returns API Tokenが保存されているか.
   */
  get isApiTokenStored(): boolean {
    return this.state.token !== "";
  }
}

export class ApiTokenMutations extends Mutations<ApiTokenState> {
  /**
   * APIトークンを保存する.
   *
   * @param token APIトークン.
   */
  public save(token: string): void {
    this.state.token = token;
  }
}

export type FetchApiTokenParameter = {
  email: string;
  password: string;
}

export class ApiTokenActions extends Actions<ApiTokenState, ApiTokenGetters, ApiTokenMutations, ApiTokenActions> {
  @Api(types.api.Identification)
  private $identification!: Identification;

  @Api(types.api.Credential)
  private $credential!: Credential;

  /**
   * API Tokenの初期化処理を行う.
   */
  public setUpToken(): void {
    const token = window.localStorage.getItem(apiTokenKey) ?? "";

    this.mutations.save(token);
  }

  /**
   * 認証APIにリクエストを発行し、返されたAPI Tokenをローカルに保存する.
   *
   * @param params
   *   APIに送信する認証パラメーター.
   * @throws {UnauthorizedError}
   *   認証に失敗した場合に送出される.
   * @throws {ApiError}
   *   APIとの通信に失敗した場合に発生する.
   */
  public async fetchApiToken(params: FetchApiTokenParameter): Promise<void> {
    const { email, password } = params;
    const response = await this.$identification.login(email, password);

    window.localStorage.setItem(apiTokenKey, response.apiToken ?? "");
    this.mutations.save(response.apiToken);
  }

  /**
   * API Tokenが有効かサーバーに問い合わせ検証する.
   *
   * @throws {UnauthorizedError}
   *   ログインユーザーの資格情報が有効では無い場合に送出される.
   * @throws {ApiError}
   *   API通信時にエラーが発生した場合に送出される.
   */
  public async verifyCrediantials(): Promise<void> {
    await this.$credential.verify();
  }

  /**
   * サーバー、及びローカルの保持しているAPI Tokenを無効化する.
   *
   * @throws {ApiError}
   *   API通信時にエラーが発生した場合に送出される.
   */
  public async deactivateApiToken(): Promise<void> {
    await this.$identification.logout();

    window.localStorage.setItem(apiTokenKey, "");

    this.mutations.save("");
  }
}

export const apiToken = new Module({
  state: ApiToken,
  getters: ApiTokenGetters,
  mutations: ApiTokenMutations,
  actions: ApiTokenActions
});

export type ApiTokenContext = ReturnType<typeof apiToken.context>;
