import { AxiosRequestConfig } from "axios";
import { types } from "@/providers/types";
import { container } from "@/providers/containers/services";
import { ApiTokenReader } from "@/services/ApiTokenReader";

/**
 * ユーザーが認証済みの場合、認証トークンをヘッダを付与する.
 *
 * @param config
 *   リクエスト設定オブジェクト.
 * @return
 *   リクエスト設定オブジェクト.
 */
export const authorization = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const apiTokenReader = container.get<ApiTokenReader>(types.services.ApiTokenReader);

  if (!apiTokenReader.isApiTokenStored) {
    return config;
  }

  /* eslint-disable no-param-reassign */
  config.headers.Authorization = `Bearer ${apiTokenReader.apiToken}`;

  return config;
};
