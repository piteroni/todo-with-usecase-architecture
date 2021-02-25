import Vue from "vue";
import Vuex, { Store } from "vuex";
import { createStore, Module } from "vuex-smart-module";
import { task, TaskState } from "@/store/modules/task";
import { apiToken, ApiTokenState } from "@/store/modules/apiToken";

Vue.use(Vuex);

export type StoreType = Store<{
  task: TaskState;
  apiToken: ApiTokenState;
}>;

export const store: StoreType = createStore(
  new Module({
    modules: {
      task,
      apiToken
    }
  })
);

export const taskContext = task.context(store);
export const apiTokenContext = apiToken.context(store);
