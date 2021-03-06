<template>
  <v-dialog v-model="isOpen" persistent overlay-color="white" width="640px">
    <v-card class="card passwordUpdateDialog">
      <v-card-title class="card-title">
        <div class="card-title-text">
          パスワードを更新する
        </div>

        <v-spacer></v-spacer>
      </v-card-title>

      <v-container>
        <v-row justify="center" align-content="center">
          <v-form class="form" ref="passwordUpdateForm">
            <div>
              <label for="password" class="col-md-3 label">
                新しいパスワード
              </label>

              <div class="col-md-12 pb-0">
                <v-text-field
                  v-model="passwordInputValue"
                  :rules="passwordRules"
                  class="password"
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
          <v-btn class="cancel mr-4" @click="cancel" :ripple="false">
            キャンセル
          </v-btn>

          <v-btn color="save primary" @click="save" :ripple="false">
            変更を保存
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Ref
} from "vue-property-decorator";
import { VForm } from "@/shared/vuetify";

@Component
export default class PasswordUpdateDialog extends Vue {
  /**
   * パスワード情報変更フォームへの参照を表す.
   */
  @Ref()
  public readonly passwordUpdateForm?: VForm;

  /**
   * コンポーネントを表示する否かを表す.
   */
  @Prop({ required: true, type: Boolean })
  public readonly isOpen!: boolean;

  /**
   * 親コンポーネントにて管理されているパスワードを表す.
   */
  @Prop({ required: true, type: String })
  public readonly passwordOrigin!: string;

  /**
   * 入力パスワード.
   */
  public passwordInputValue = "";

  /**
   * メールアドレス欄のバリデーションルールを取得する.
   */
  public get passwordRules(): Array<Function> {
    return [
      (v: string) => !!v || "パスワードを入力してください",
      (v: string) => (!!v && v.length >= 8) || "パスワードは最低8文字以上入力してください",
      (v: string) => (!!v && this.passwordRegularExpresion.test(v)) || "半角英数字記号をそれぞれ1種類以上含めてください"
    ];
  }

  /**
   * パスワードを構成する文字列に関する正規表現を取得する.
   */
  public get passwordRegularExpresion(): RegExp {
    return /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-/:-@[-`{-~])[!-~]{0,}$/i;
  }

  /**
   * 保存ボタンのクリックイベントをハンドリングする.
   */
  public save() {
    if (!this.passwordUpdateForm?.validate()) {
      return;
    }

    this.$emit("update:password-origin", this.passwordInputValue);
    this.$emit("update:is-open", false);
  }

  /**
   * キャンセルボタンのクリックイベントをハンドリングする.
   */
  public cancel() {
    /* eslint-disable no-unused-expressions */
    this.passwordUpdateForm?.reset();
    this.$emit("update:is-open", false);
    this.passwordInputValue = this.passwordOrigin;
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
