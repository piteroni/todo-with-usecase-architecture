<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height align-start>
    <loading :loading="loading" v-if="loading" />

    <v-layout class="profile" v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <logo></logo>

          <v-spacer />
          <more-menu />
        </navbar>

        <v-container fluid class="mx-12">
          <setting-form :profile="profile" />
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { types } from "@/providers/types";
import { Api } from "@/providers/containers/api";
import { User } from "@/api/User";
import Logo from "@/components/singletons/Logo.vue";
import Navbar from "@/components/singletons/Navber.vue";
import MoreMenu from "@/components/singletons/MoreMenu.vue";
import Loading from "@/components/singletons/Loading.vue";
import { RedirectIfUnauthenticated } from "@/mixins/RedirectIfUnauthenticated";
import SettingForm from "./SettingForm.vue";
import { Profile as ProfileType } from "./types";

@Component({
  components: {
    "logo": Logo,
    "loading": Loading,
    "navbar": Navbar,
    "more-menu": MoreMenu,
    "setting-form": SettingForm
  }
})
export default class Profile extends Mixins(RedirectIfUnauthenticated) {
  @Api(types.api.User)
  private $user!: User;

  /**
   * ローディング状態を保持する.
   */
  public loading = true;

  /**
   * ログインユーザーのユーザー情報.
   */
  public profile: ProfileType = {
    name: "",
    email: ""
  };

  public async mounted() {
    let isRedirect = false;

    try {
      isRedirect = await this.redirectIfUnauthenticated();
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");

      return;
    }

    if (isRedirect) {
      return;
    }

    try {
      this.profile = await this.$user.getProfile();
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");

      return;
    }

    this.loading = false;
  }
}
</script>
