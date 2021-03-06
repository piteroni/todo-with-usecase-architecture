<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-bottom="45"
    offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list class="py-0">
        <v-list-item @click="manageTasks" :ripple="false" class="list-item">
          <v-list-item-content>
            <v-list-item-subtitle>
              タスクの管理
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="settings" :ripple="false" class="list-item">
          <v-list-item-content>
            <v-list-item-subtitle>
              ユーザー設定
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout" :ripple="false" class="list-item">
          <v-list-item-content>
            <v-list-item-subtitle>
              ログアウト
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { types } from "@/providers/types";
import { VuexContext } from "@/providers/containers/vuexContext";
import { ApiTokenContext } from "@/store/modules/apiToken";
import { routeNames } from "@/router/routeNames";

@Component
export default class MoreMenu extends Vue {
  @VuexContext(types.vuexContexts.apiToken)
  private $apiToken!: ApiTokenContext;

  /**
   * メニューを表示するか否かを保持する.
   */
  public menu = false;

  /**
   * タスク管理ボタンのクリックイベントを処理する.
   */
  public async manageTasks(): Promise<void> {
    this.$router.push({ name: routeNames.dashboard });
  }

  /**
   * ユーザー設定ボタンのクリックイベントを処理する.
   */
  public async settings(): Promise<void> {
    this.$router.push({ name: routeNames.profile });
  }

  /**
   * ログアウトボタンのクリックイベントを処理する.
   */
  public async logout(): Promise<void> {
    try {
      await this.$apiToken.actions.deactivateApiToken();
    } catch (e) {
      this.$notify.error("問題が発生しました");
      console.error(e);
      return;
    }

    this.$router.push({ name: routeNames.login });
  }
}
</script>

<style lang="scss" scoped>
.list-item:hover {
  background-color: rgba($color: #000000, $alpha: 0.03);
}
</style>
