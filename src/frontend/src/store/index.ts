import Vue from "vue";
import Vuex from "vuex";
import { createStore, Module } from "vuex-smart-module";
import { task } from "@/store/modules/task";
import { apiToken } from "@/store/modules/apiToken";
import { Store } from "@/store/types";

Vue.use(Vuex);

export const store: Store = createStore(
  new Module({
    modules: {
      task,
      apiToken
    }
  })
);
