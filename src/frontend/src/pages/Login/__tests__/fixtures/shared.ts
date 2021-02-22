import { RouteConfig } from "vue-router";
import flushPromises from "flush-promises";

export const routes: Array<RouteConfig> = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: { template: "<div></div>" }
  }
];

/**
 * マウントが完了するまで待つ.
 */
export const waitUntilForMounted = async (): Promise<void> => {
  await flushPromises();
};
