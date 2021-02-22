<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height>
    <loading :loading="loading" v-if="loading" />

    <v-layout v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <logo />
        </navbar>

        <div class="container">
          <login-form />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { types } from "@/providers/types";
import { VuexContext } from "@/providers/containers/vuexContext";
import { ApiTokenContext } from "@/store/modules/apiToken";
import { routeNames } from "@/router/routeNames";
import { UnauthorizedError } from "@/api/exceptions";
import Navbar from "@/components/singletons/Navber.vue";
import Logo from "@/components/singletons/Logo.vue";
import Loading from "@/components/singletons/Loading.vue";
import LoginForm from "./LoginForm.vue";

@Component({
  components: {
    "logo": Logo,
    "navbar": Navbar,
    "loading": Loading,
    "login-form": LoginForm,
  }
})
export default class Login extends Vue {
  @VuexContext(types.vuexContexts.apiToken)
  private $apiToken!: ApiTokenContext;

  /**
   * ローディング状態を保持する.
   */
  public loading = true;

  async mounted() {
    let isRedirect = false;

    try {
      isRedirect = await this.redirectIfAuthenticated();
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");

      return;
    }

    if (isRedirect) {
      return;
    }

    this.loading = false;
  }

  /**
   * ユーザーが認証済みの場合に、リダイレクトを行う.
   *
   * @return
   *   リダイレクトが行われたか否か.
   */
  private async redirectIfAuthenticated(): Promise<boolean> {
    await this.$apiToken.actions.setUpToken();

    if (!this.$apiToken.getters.isApiTokenStored) {
      return false;
    }

    try {
      await this.$apiToken.actions.verifyCrediantials();
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return false;
      }

      throw e;
    }

    this.$router.push({ name: routeNames.dashboard });

    return true;
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 50px;
}
</style>
