<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height align-start>
    <loading :loading="loading" v-if="loading" />

    <v-layout v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <strong class="my-auto">
            Todo with usecase architecture
          </strong>

          <v-spacer />
          <more-menu />
        </navbar>

        <v-container fluid class="mx-12">
          <v-form ref="form" lazy-validation>
            <v-col cols="4" class="pa-0">
              <v-layout>
                <v-text-field
                  v-model="taskName"
                  label="タスク"
                  :rules="taskRules"
                ></v-text-field>

                <div class="my-auto">
                  <v-btn icon @click="handleClickOnCreateButton">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
              </v-layout>
            </v-col>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Ref, Mixins } from "vue-property-decorator";
import { types } from "@/providers/types";
import { Api } from "@/providers/containers/api";
import { User } from "@/api/User";
import { ClientError, ServerError } from "@/api/exceptions";
import { RedirectIfUnauthenticated } from "@/mixins/RedirectIfUnauthenticated";
import { VForm } from "@/shared/vuetify";
import Navbar from "@/components/singletons/Navber.vue";
import MoreMenu from "@/components/singletons/MoreMenu.vue";
import Loading from "@/components/singletons/Loading.vue";

@Component({
  components: {
    "loading": Loading,
    "navbar": Navbar,
    "more-menu": MoreMenu,
  }
})
export default class Dashboard extends Mixins(RedirectIfUnauthenticated) {
  @Ref()
  public form!: VForm;

  @Api(types.api.User)
  private $user!: User;

  /**
   * ローディング状態を保持する.
   */
  public loading = true;

  /**
   * タスク内容を保持する.
   */
  public taskName = "";

  /**
   * タスクのバリデーションルールを取得する.
   */
  public get taskRules(): Array<Function> {
    return [
      (v: string) => !!v || "タスクを入力してください",
    ];
  }

  private async mounted() {
    try {
      await this.redirectIfUnauthenticated();
    } catch (e) {
      console.error(e);

      this.$notify.error("問題が発生しました");
    }

    this.loading = false;
  }

  /**
   * タスク作成ボタンのクリックイベントを処理する.
   */
  public async handleClickOnCreateButton(): Promise<void> {
    if (!this.isValid()) {
      return;
    }

    try {
      await this.$user.createTask(this.taskName);
    } catch (e) {
      if (e instanceof ClientError) {
        this.$notify.error(e.message);
      } else if (e instanceof ServerError) {
        this.$notify.error("サーバーで問題が発生しました");
      } else {
        this.$notify.error("問題が発生しました");
      }

      return;
    }

    this.reset();
  }

  /**
   * フォーム内の入力値が有効であるか取得する.
   *
   * @return
   *   フォーム内の入力値が有効であるか.
   */
  public isValid(): boolean {
    return this.form.validate();
  }

  /**
   * フォームの値を初期化する.
   */
  public reset(): void {
    this.form.reset();
    this.taskName = "";
  }
}
</script>
