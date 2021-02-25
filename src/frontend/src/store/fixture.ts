import { createStore as baseCreateStore, Module } from "vuex-smart-module";

/**
 * Storeを作成する.
 *
 * @param modules
 *   store modulesに指定するモジュール
 * @returns
 *   作成済みのStore.
 */
export const createStore = (modules: Record<string, Module<any, any, any, any, any>>) => baseCreateStore(new Module({ modules }));
