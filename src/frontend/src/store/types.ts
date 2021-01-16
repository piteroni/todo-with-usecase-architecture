import { Store as BaseStore } from "vuex";
import { Module } from "vuex-smart-module";
import { ApiToken } from "@/store/modules/apiToken";

export type InitializationRequired = {
  isInit: boolean;
};

export type ModuleType = Module<any, any, any, any, any>;

export type Store = BaseStore<{
  apiToken: ApiToken;
}>;
