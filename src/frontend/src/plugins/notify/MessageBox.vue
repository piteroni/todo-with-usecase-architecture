<template>
  <div :class="[this.$style.wrapper, this.$style[type]]">
    <div :class="this.$style.title">{{ title }}</div>
    <div :class="this.$style.message">{{ message }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { NotifyType } from "./types";

@Component
export default class MessageBox extends Vue {
  @Prop({ default: "" })
  public title!: string;

  @Prop({ default: "" })
  public message!: string;

  @Prop({ default: "info" })
  public type!: NotifyType;
}
</script>

<style module>
.wrapper {
  width: 360px;
  min-height: 12px;
  padding: 12px 24px;
  margin: 24px;
  font-family: "Noto Sans JP", sans-serif;
  font-size: 0.9em;
  border-radius: 5px;
  box-shadow: 0px 6px 28px 0px rgba(0, 0, 0, 0.14);
}
.title {
  padding: 12px 0;
  font-size: 1.2em;
  font-weight: 700;
}
.message {
  white-space: pre-line;
  line-height: 25px;
  padding-bottom: 12px;
}

/* Component Type */

.info {
  background-color: #b1dee9;
  border: 0 solid #0286a5;
}
.success {
  background-color: #b1e9bd;
  border: 0 solid #02a502;
}
.warning {
  background-color: #fff2c8;
  border: 0 solid #c6c600;
}
.error {
  background-color: #e9b1b1;
  border: 0 solid #ca002c;
}
</style>
