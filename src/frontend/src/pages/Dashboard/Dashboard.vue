<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height align-start>
    <loading :loading="loading" v-if="loading" />

    <v-layout v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <logo></logo>

          <v-spacer />
          <more-menu />
        </navbar>

        <v-container fluid class="mx-12">
          <task-create-form />
          <task-list />
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { RedirectIfUnauthenticated } from "@/mixins/RedirectIfUnauthenticated";
import { types } from "@/providers/types";
import { VuexContext } from "@/providers/containers/vuexContext";
import { TaskContext } from "@/store/modules/task";
import Logo from "@/components/singletons/Logo.vue";
import Navbar from "@/components/singletons/Navber.vue";
import MoreMenu from "@/components/singletons/MoreMenu.vue";
import Loading from "@/components/singletons/Loading.vue";
import TaskCreateForm from "./TaskCreateForm.vue";
import TaskList from "./TaskList.vue";

@Component({
  components: {
    "logo": Logo,
    "loading": Loading,
    "navbar": Navbar,
    "more-menu": MoreMenu,
    "task-create-form": TaskCreateForm,
    "task-list": TaskList
  }
})
export default class Dashboard extends Mixins(RedirectIfUnauthenticated) {
  @VuexContext(types.vuexContexts.task)
  private $task!: TaskContext;

  /**
   * ローディング状態を保持する.
   */
  public loading = true;

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
      await this.$task.actions.fetchTasks();
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");

      return;
    }

    this.loading = false;
  }
}
</script>
