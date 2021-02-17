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
          <v-form ref="form" lazy-validation class="mb-6">
            <v-col cols="4" class="pa-0">
              <v-subheader class="pb-2 px-0 subtitle-1">
                タスク登録
              </v-subheader>

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

          <div>
            <v-subheader class="pb-2 px-0 subtitle-1">
              タスク一覧
            </v-subheader>

            <ul>
              <li v-for="(task, index) in tasks" :key="index">
                <v-layout>
                  <v-col cols="4" class="pa-0">
                    <div>{{ task.name }}</div>
                  </v-col>

                  <div class="my-auto">
                    <v-btn icon @click="() => handleClickOnTaskDeleteButton(task.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </v-layout>
              </li>
            </ul>
          </div>
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
import { Task } from "./types";

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
   * タスクのリストを保持する.
   */
  public tasks: Task[] = [];

  /**
   * タスクのバリデーションルールを取得する.
   */
  public get taskRules(): Array<Function> {
    return [
      (v: string) => !!v || "タスクを入力してください",
    ];
  }

  public async mounted() {
    try {
      await this.redirectIfUnauthenticated();
    } catch (e) {
      console.error(e);

      this.$notify.error("問題が発生しました");
    }

    await this.fetchTasks();

    this.loading = false;
  }

  /**
   * タスクのリストをサーバーから取得する.
   */
  private async fetchTasks(): Promise<void> {
    try {
      this.tasks = await this.$user.getTasks();
    } catch (e) {
      console.error(e);

      this.$notify.error("問題が発生しました");
    }
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

    await this.fetchTasks();
  }

  /**
   * フォーム内の入力値が有効であるか取得する.
   *
   * @return
   *   フォーム内の入力値が有効であるか.
   */
  private isValid(): boolean {
    return this.form.validate();
  }

  /**
   * フォームの値を初期化する.
   */
  private reset(): void {
    this.form.reset();
    this.taskName = "";
  }

  /**
   * タスク削除ボタンのクリックイベントを処理する.
   *
   * @param taskId
   *   削除対象のタスクのID.
   */
  public async handleClickOnTaskDeleteButton(taskId: number): Promise<void> {
    try {
      await this.$user.deleteTask(taskId);
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");
    }

    await this.fetchTasks();
  }
}
</script>
