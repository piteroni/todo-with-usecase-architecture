import { PostLoginResponse } from "@/api/Identification/types";
import flushPromises from "flush-promises";
import VueRouter, { RouteConfig } from "vue-router";

export const routes: Array<RouteConfig> = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: { template: "<div></div>" }
  }
];

export const router = new VueRouter({
  mode: "history",
  routes,
});

const loginReturnValue = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdO";

export const loginMock = async (): Promise<PostLoginResponse> => ({
  apiToken: loginReturnValue
});

export const waitUntilForMounted = async (): Promise<void> => {
  await flushPromises();
}

export const waitUntilAuthenticated = async (): Promise<void> => {
  await flushPromises();
}
