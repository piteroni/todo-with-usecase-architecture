<template>
  <div>
    <password-update-dialog :is-open.sync="isOpenPasswordUpdateDialog" :password-origin.sync="inputValues.password" />

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
              v-model="inputValues.email"
              :rules="emailRules"
              outlined
              dense
            />
          </div>
        </v-row>

        <v-row>
          <label for="hidden-password" class="col-md-3 label">
            パスワード
          </label>

          <div class="col-md-8 pb-0">
            <v-text-field
              class="hidden-password hiddenPassword"
              type="password"
              v-model="passwordStub"
              @click="updatePassword"
              readonly
              outlined
              dense
            />
          </div>
        </v-row>

        <v-layout class="mt-4" justify-center>
          <v-btn
            class="updateButton px-5"
            depressed
            @click="updateProfile"
            color="primary"
            :ripple="false"
            :loading="isUpdating"
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
  @Api(types.api.User)
  private readonly $user!: User;

  @Ref()
  public readonly form!: VForm;

  /**
   * サーバーから取得したログインユーザーのユーザー情報.
   */
  @Prop({ required: true, type: Object })
  public readonly profile!: Profile;

  /**
   * ユーザー情報を更新中か否かを表す.
   */
  public isUpdating = false;

  /**
   * パスワード更新ダイアログを表示するかを保持する.
   */
  public isOpenPasswordUpdateDialog = false;

  /**
   * 入力データを表す.
   */
  public inputValues = {
    username: "",
    email: "",
    password: "",
  };

  /**
   * 表示用のパスワードを表す.
   */
  public passwordStub = "";

  /**
   * ユーザー名欄のバリデーションルールを取得する.
   */
  public get usernameRules(): Array<Function> {
    return [
      (v: string) => !!v || "ユーザ名を入力してください",
    ];
  }

  /**
   * メールアドレス欄のバリデーションルールを取得する.
   */
  public get emailRules(): Array<Function> {
    return [
      (v: string) => !!v || "メールアドレスを入力してください",
    ];
  }

  public async created() {
    this.inputValues.username = this.profile.name;
    this.inputValues.email = this.profile.email;
    this.passwordStub = "dummyPassword";

    this.watchPasswordInputValue();
  }

  /**
   * 入力用のパスワードの更新を監視する.
   */
  public async watchPasswordInputValue() {
    this.$watch(() => this.inputValues.password, (newPassword: string) => {
      this.passwordStub = newPassword;
    });
  }

  /**
   * 更新ボタンのクリックイベントをハンドリングする.
   */
  public async updateProfile(): Promise<void> {
    if (!this.form.validate()) {
      return;
    }

    const params: Record<string, string> = {};

    this.isUpdating = true;

    if (this.inputValues.username !== this.profile.name) {
      params.name = this.inputValues.username;
    }

    if (this.inputValues.email !== this.profile.email) {
      params.email = this.inputValues.email;
    }

    if (this.inputValues.password !== "") {
      params.password = this.inputValues.password;
    }

    let updatedProfile!: Profile;

    try {
      updatedProfile = await this.$user.updateProfile(params);
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");

      return;
    }

    this.$emit("update:profile", updatedProfile);

    this.isUpdating = false;

    this.$notify.success("プロフィールを更新しました！");
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
