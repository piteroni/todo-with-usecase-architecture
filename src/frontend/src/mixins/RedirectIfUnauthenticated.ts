import { Vue, Component } from "vue-property-decorator";
import { types } from "@/providers/types";
import { Api } from "@/providers/containers/api";
import { VuexContext } from "@/providers/containers/vuexContext";
import { User } from "@/api/User";
import { UnauthorizedError } from "@/api/User/UnauthorizedError";
import { ApiTokenContext } from "@/store/modules/apiToken";
import { routeNames } from "@/router/routeNames";

// Mixinが依存するオブジェクトを定義する.
class Dependence {
  @VuexContext(types.vuexContexts.apiToken)
  public $apiToken!: ApiTokenContext;

  @Api(types.api.User)
  public $user!: User;
}

@Component
export class RedirectIfUnauthenticated extends Vue {
  /**
   * ユーザーが認証済みでない場合に、リダイレクトを行う.
   *
   * @throws {ApiError}
   *   401以外のAPIエラーが発生した場合に送出される.
   */
  public async redirectIfUnauthenticated() {
    const dependence = new Dependence();

    await dependence.$apiToken.actions.setUpToken();

    if (!dependence.$apiToken.getters.isApiTokenStored) {
      this.$router.push({ name: routeNames.login });
    }

    try {
      await dependence.$user.verifyCrediantials();
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        this.$router.push({ name: routeNames.login, query: { isRedirect: "true" } });
        return;
      }

      throw e;
    }
  }
}
