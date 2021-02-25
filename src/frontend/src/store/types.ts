import { Store as BaseStore } from "vuex";
import { Module } from "vuex-smart-module";
import { ApiToken } from "@/store/modules/apiToken";
import { TaskState } from "./modules/task";

export type InitializationRequired = {
  isInit: boolean;
};

export type ModuleType = Module<any, any, any, any, any>;

export type Store = BaseStore<{
  apiToken: ApiToken;
  task: TaskState;
}>;
