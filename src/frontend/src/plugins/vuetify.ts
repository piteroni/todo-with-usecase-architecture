import Vue from "vue";
import { UserVuetifyPreset } from "vuetify";
import ja from "vuetify/src/locale/ja";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

const options: UserVuetifyPreset = {
  icons: {
    iconfont: "mdiSvg",
  },
  lang: {
    locales: { ja },
    current: "ja",
  }
};

export default new Vuetify(options);
