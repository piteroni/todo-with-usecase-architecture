import { injectable } from "inversify";
import { apiTokenKey } from "@/shared/localStorageKeys";

// apiToken Vuex Moduleとapiにapi tokenを付与する際に循環参照しないために
// api用に読み取り機能を追加.
@injectable()
export class ApiTokenReader {
  /**
   * API Tokenが保存されているか取得する.
   */
  get isApiTokenStored(): boolean {
    return window.localStorage.getItem(apiTokenKey) !== null;
  }

  /**
   * ローカルストレージに保存されているAPI Tokenを取得する.
   */
  get apiToken(): string | null {
    return window.localStorage.getItem(apiTokenKey);
  }
}
