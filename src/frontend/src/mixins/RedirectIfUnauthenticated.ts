import { Vue, Component } from "vue-property-decorator";
import { types } from "@/providers/types";
import { container as vuexContextContainer } from "@/providers/containers/vuexContext";
import { UnauthorizedError } from "@/api/exceptions";
import { ApiTokenContext } from "@/store/modules/apiToken";
import { routeNames } from "@/router/routeNames";

@Component
export class RedirectIfUnauthenticated extends Vue {
  /**
   * ユーザーが認証済みでない場合にログイン画面にリダイレクトを行う.
   *
   * @return
   *   リダイレクトを実施したか否か.
   * @throws {ApiError}
   *   401以外のAPIエラーが発生した場合に送出される.
   */
  protected async redirectIfUnauthenticated(): Promise<boolean> {
    const apiToken = vuexContextContainer.get<ApiTokenContext>(types.vuexContexts.apiToken);

    await apiToken.actions.setUpToken();

    if (!apiToken.getters.isApiTokenStored) {
      this.$router.push({ name: routeNames.login });
      return true;
    }

    try {
      await apiToken.actions.verifyCrediantials();
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        this.$router.push({ name: routeNames.login, query: { isRedirect: "true" } });
        return true;
      }

      throw e;
    }

    return false;
  }
}
