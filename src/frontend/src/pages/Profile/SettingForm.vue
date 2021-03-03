<template>
  <div>
    <password-update-dialog :is-open.sync="isOpenPasswordUpdateDialog" :new-password.sync="inputValues.newPassword" />

    <v-form ref="form" lazy-validation class="mb-6">
      <v-col cols="4" class="pa-0">
        <v-subheader class="pb-2 px-0 subtitle-1">
          ユーザー設定
        </v-subheader>

        <v-row>
          <label for="username" class="col-md-3 label">
            ユーザー名
          </label>

          <div class="col-md-8 pb-0">
            <v-text-field
              class="username"
              type="text"
              name="username"
              v-model="inputValues.username"
              :rules="usernameRules"
              outlined
              dense
            />
          </div>
        </v-row>

        <v-row>
          <label for="email" class="col-md-3 label">
            メールアドレス
          </label>

          <div class="col-md-8 pb-0">
            <v-text-field
              class="email"
              type="email"
              name="email"
              v-model="inputValues.email"
              :rules="emailRules"
              outlined
              dense
            />
          </div>
        </v-row>

        <v-row>
          <label for="password" class="col-md-3 label">
            パスワード
          </label>

          <div class="col-md-8 pb-0">
            <v-text-field
              class="password"
              type="password"
              name="password"
              v-model="password"
              @click="updatePassword"
              readonly
              outlined
              dense
            />
          </div>
        </v-row>

        <v-layout class="mt-4" justify-center>
          <v-btn
            class="updateButton px-6"
            depressed
            @click="updateProfile"
            color="primary"
          >
            更新
          </v-btn>
        </v-layout>
      </v-col>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Ref
} from "vue-property-decorator";
import { types } from "@/providers/types";
import { Api } from "@/providers/containers/api";
import { User } from "@/api/User";
import { VForm } from "@/shared/vuetify";
import { Profile } from "./types";
import PasswordUpdateDialog from "./PasswordUpdateDialog.vue";

@Component({
  components: {
    "password-update-dialog": PasswordUpdateDialog
  }
})
export default class Settings extends Vue {
  @Ref()
  public readonly form!: VForm;

  @Prop({ required: true, type: Object })
  public readonly profile!: Profile;

  @Api(types.api.User)
  private readonly $user!: User;

  /**
   * パスワード更新ダイアログを表示するかを保持する.
   */
  public isOpenPasswordUpdateDialog = false;

  /**
   * 入力データを保持する.
   */
  public inputValues = {
    username: "",
    email: "",
    newPassword: "",
  };

  /**
   * ダミー用のパスワードを表す.
   */
  public password = "";

  private querys: Record<string, string> = {};

  public get initialPasswordValue(): string {
    return "dummyPassword";
  }

  /**
   * ユーザー名欄のバリデーションルールを取得する.
   */
  public get usernameRules(): Array<Function> {
    return [
      (v: string) => !!v || "ユーザ名を入力してください",
    ];
  }

  /**
   * ユーザー名欄のバリデーションルールを取得する.
   */
  public get emailRules(): Array<Function> {
    return [
      (v: string) => !!v || "メールアドレスを入力してください",
    ];
  }

  public async created() {
    this.inputValues.username = this.profile.name;
    this.inputValues.email = this.profile.email;
    this.inputValues.newPassword = this.initialPasswordValue;

    this.watchNewPassword();
  }

  public async watchNewPassword() {
    this.$watch(() => this.inputValues.newPassword, (newPassword: string) => {
      this.password = newPassword;
    });
  }

  /**
   * 更新ボタンのクリックイベントをハンドリングする.
   */
  public async updateProfile(): Promise<void> {
    if (this.profile.name !== this.inputValues.username) {
      this.querys.name = this.inputValues.username;
    }

    if (this.profile.email !== this.inputValues.email) {
      this.querys.email = this.inputValues.email;
    }

    if (this.initialPasswordValue !== this.inputValues.username) {
      this.querys.password = this.inputValues.username;
    }
  }

  /**
   * パスワード欄のクリックイベントをハンドリングする.
   */
  public async updatePassword() {
    this.isOpenPasswordUpdateDialog = true;
  }
}
</script>

<style lang="scss" scoped>
.label {
  font-size: 14.5px;
  font-weight: 400;
  margin-top: 10px;
}
</style>
