import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Login from "@/pages/Login/Login.vue";
import Dashboard from "@/pages/Dashboard/Dashboard.vue";
import Profile from "@/pages/Profile/Profile.vue";
import NotFound from "@/pages/Error/NotFound.vue";
import { routeNames } from "./routeNames";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: routeNames.login,
    component: Login,
  },
  {
    path: "/dashboard",
    name: routeNames.dashboard,
    component: Dashboard,
  },
  {
    path: "/profile",
    name: routeNames.profile,
    component: Profile
  },
  {
    path: "*",
    name: routeNames.notFound,
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
