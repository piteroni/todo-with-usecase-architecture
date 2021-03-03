<template>
  <v-dialog v-model="isOpen" persistent overlay-color="white" width="640px">
    <v-card class="card">
      <v-card-title class="card-title">
        <div class="card-title-text">
          パスワードを更新する
        </div>

        <v-spacer></v-spacer>
      </v-card-title>

      <v-container>
        <v-row justify="center" align-content="center">
          <v-form class="form">
            <div>
              <label for="new-password" class="col-md-3 label">
                新しいパスワード
              </label>

              <div class="col-md-12 pb-0">
                <v-text-field
                  v-model="newPasswordInputValue"
                  class="new-password"
                  name="new-password"
                  outlined
                  dense
                />
              </div>
            </div>
          </v-form>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="my-2 mr-2">
          <v-btn class="mr-4" @click="close" :ripple="false">
            キャンセル
          </v-btn>

          <v-btn color="primary" @click="save" :ripple="false">
            保存
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class PasswordUpdateDialog extends Vue {
  @Prop({ required: true, type: Boolean })
  public readonly isOpen!: boolean;

  @Prop({ required: true, type: String })
  public readonly newPassword!: string;

  /**
   * 入力された新しいパスワード.
   */
  public newPasswordInputValue = "";

  public created() {
    this.watchIsOpen();
  }

  // @todo: sync if updatedPropsみたいな名前もいいかもな
  public watchIsOpen() {
    this.$watch(() => this.isOpen, (isOpen: boolean) => {
      if (isOpen) {
        this.newPasswordInputValue = this.newPassword;
      }
    });
  }

  /**
   * 保存ボタンのクリックイベントをハンドリングする.
   */
  public save() {
    this.$emit("update:new-password", this.newPasswordInputValue);
    this.$emit("update:is-open", false);
  }

  /**
   * モーダルを閉じる.
   */
  public close() {
    // @see .sync - vue 2.3
    this.$emit("update:is-open", false);
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 480px;
  padding: 15px;
  font-size: 14.5px;
  font-weight: 400;
}
.card {
  font-family: "Noto Sans JP", sans-serif;
  background-color: white;
  overflow-y: hidden;
}
.card-title {
  padding: 14px 22px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15) !important;
}
.card-title-text {
  color: #767676;
  font-size: 18.72px;
}
.label {
  color: rgb(99, 99, 99) !important;
  font-size: 14.5px;
}
</style>
