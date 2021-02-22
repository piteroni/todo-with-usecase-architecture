import { Module } from "vuex-smart-module";
import {
  ApiTokenActions, ApiTokenGetters, ApiTokenMutations, ApiTokenState
} from "@/store/modules/apiToken";
import { ServerError, UnauthorizedError } from "@/api/exceptions";

// 通常のスタブ
export const apiTokenStub = new Module({
  state: ApiTokenState,
  getters: ApiTokenGetters,
  mutations: ApiTokenMutations,
  actions: ApiTokenActions,
});

apiTokenStub.options.actions = class extends ApiTokenActions {
  // 認証例外を発生させるようにする
  public async verifyCrediantials() {
    throw new UnauthorizedError("message", 1, "code");
  }
};

// 認証済みのスタブ
export const apiTokenStubWithAuthed = new Module({
  state: ApiTokenState,
  getters: ApiTokenGetters,
  mutations: ApiTokenMutations,
  actions: ApiTokenActions,
});

apiTokenStubWithAuthed.options.actions = class extends ApiTokenActions {
  // トークンを無条件で更新するようにする
  public setUpToken(): void {
    this.mutations.update("token");
  }

  // 認証例外を発生しないように空のメソッドを宣言するようにする
  public async verifyCrediantials(): Promise<void> {
    return;
  }
};

// 例外を送出するスタブ
export const apiTokenStubWithException = new Module({
  state: ApiTokenState,
  getters: ApiTokenGetters,
  mutations: ApiTokenMutations,
  actions: ApiTokenActions,
});

apiTokenStubWithException.options.actions = class extends ApiTokenActions {
  public setUpToken(): void {
    this.mutations.update("token");
  }

  public async verifyCrediantials(): Promise<void> {
    throw new ServerError("message");
  }
};
