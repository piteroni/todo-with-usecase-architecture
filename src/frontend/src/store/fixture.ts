import { createStore as baseCreateStore, Module } from "vuex-smart-module";
import { ModuleType } from "@/store/types";

/**
 * Storeを作成する.
 *
 * @param modules
 *   store modulesに指定するモジュール
 * @returns
 *   作成済みのStore.
 */
export const createStore = (modules: Record<string, ModuleType>) => baseCreateStore(new Module({ modules }));
