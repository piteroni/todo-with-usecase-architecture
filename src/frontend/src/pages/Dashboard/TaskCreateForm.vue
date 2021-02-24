<template>
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
          <v-btn icon @click="createTask">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-layout>
    </v-col>
  </v-form>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { types } from "@/providers/types";
import { VuexContext } from "@/providers/containers/vuexContext";
import { TaskContext } from "@/store/modules/task";
import { VForm } from "@/shared/vuetify";

@Component
export default class TaskCreateForm extends Vue {
  @Ref()
  public form!: VForm;

  @VuexContext(types.vuexContexts.task)
  private $task!: TaskContext;

  /**
   * タスク内容を保持する.
   */
  public taskName = "";

  /**
   * フォーム内の入力値が有効であるか取得する.
   *
   * @return
   *   フォーム内の入力値が有効であるか.
   */
  private get isValid(): boolean {
    return this.form.validate();
  }

  /**
   * タスクのバリデーションルールを取得する.
   */
  public get taskRules(): Array<Function> {
    return [
      (v: string) => !!v || "タスクを入力してください",
    ];
  }

  /**
   * タスク作成ボタンのクリックイベントを処理する.
   */
  public async createTask(): Promise<void> {
    if (!this.isValid) {
      return;
    }

    try {
      await this.$task.actions.createTask(this.taskName);
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");

      return;
    }

    this.reset();

    try {
      await this.$task.actions.fetchTasks();
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");
    }
  }

  /**
   * フォームの値を初期化する.
   */
  private reset(): void {
    this.form.reset();
    this.taskName = "";
  }
}
</script>

<style>

</style>
