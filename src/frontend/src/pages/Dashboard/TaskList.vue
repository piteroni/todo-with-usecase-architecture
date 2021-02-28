<template>
  <div>
    <v-subheader class="pb-2 px-0 subtitle-1">
      タスク一覧
    </v-subheader>

    <ul class="taskList">
      <li class="task" v-for="(task, index) in tasks" :key="index">
        <v-layout>
          <v-col cols="4" class="pa-0">
            <div class="taskName">{{ task.name }}</div>
          </v-col>

          <div class="my-auto">
            <v-btn class="deleteButton" icon @click="() => deleteTask(task.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-layout>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { types } from "@/providers/types";
import { VuexContext } from "@/providers/containers/vuexContext";
import { TaskContext } from "@/store/modules/task";
import { Task } from "./types";

@Component
export default class TaskList extends Vue {
  @VuexContext(types.vuexContexts.task)
  private $task!: TaskContext;

  /**
   * タスクを取得する.
   */
  public get tasks(): Task[] {
    return this.$task.state.tasks;
  }

  /**
   * タスク削除ボタンのクリックイベントを処理する.
   *
   * @param taskId
   *   削除対象のタスクのID.
   */
  public async deleteTask(taskId: number): Promise<void> {
    try {
      await this.$task.actions.deleteTask(taskId);
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");
    }
  }
}
</script>
