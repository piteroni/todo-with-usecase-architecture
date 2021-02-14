<template>
  <v-container class="grey lighten-5 pa-0" fluid fill-height>
    <loading :loading="loading" v-if="loading" />

    <v-layout v-else justify-center align-center>
      <v-flex fill-height>
        <navbar>
          <strong class="my-auto">
            Todo with usecase architecture
          </strong>
        </navbar>

        <div class="container">
          <v-row justify="center" align-content="center">
            <v-col class="col-md-8">
              <v-card elevation="0" class="card">
                <div class="card-title">
                  ログインフォーム
                </div>

                <v-form ref="form" class="pa-2" lazy-validation>
                  <v-row>
                    <label for="email" class="col-md-4 text-md-right label">
                      メールアドレス
                    </label>

                    <div class="col-md-6 pb-0">
                      <v-text-field
                        id="email"
                        type="email"
                        name="email"
                        v-model="email"
                        :rules="emailRules"
                        outlined
                        dense
                      />
                    </div>
                  </v-row>

                  <v-row>
                    <label for="password" class="col-md-4 text-md-right label">
                      パスワード
                    </label>

                    <div class="col-md-6 pb-0">
                      <v-text-field
                        id="password"
                        v-model="password"
                        type="password"
                        name="password"
                        :rules="passwordRules"
                        outlined
                        dense
                      />
                    </div>
                  </v-row>

                  <v-row v-if="isError">
                    <span
                      class="col-md-6 offset-md-4 py-0 invalid-feedback"
                    >
                      <strong>{{ errorMessage }}</strong>
                    </span>
                  </v-row>

                  <v-row v-if="isRedirect">
                    <span
                      class="col-md-6 offset-md-4 py-0 invalid-feedback"
                    >
                      <strong>ログイン時間が一定期間を過ぎました、再度ログインをお願いします</strong>
                    </span>
                  </v-row>

                  <v-row class="mb-0">
                    <div class="col-md-8 offset-md-4">

                      <v-btn
                        id="submitButton"
                        @click="handleClickOnLoginButton"
                        depressed
                        color="primary"
                      >
                        ログイン
                      </v-btn>
                    </div>
                  </v-row>
                </v-form>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Ref } from "vue-property-decorator";
import { types } from "@/providers/types";
import { VuexContext } from "@/providers/containers/vuexContext";
import { ApiTokenContext } from "@/store/modules/apiToken";
import { routeNames } from "@/router/routeNames";
import { ClientError, ServerError } from "@/api/exceptions";
import { VForm } from "@/shared/vuetify";
import { UnauthorizedError } from "@/api/User/UnauthorizedError";
import Navbar from "@/components/singletons/Navber.vue";
import Loading from "@/components/singletons/Loading.vue";

@Component({
  components: {
    "navbar": Navbar,
    "loading": Loading
  }
})
export default class Login extends Vue {
  @Ref()
  public form!: VForm;

  @VuexContext(types.vuexContexts.apiToken)
  private $apiToken!: ApiTokenContext;

  /**
   * ローディング状態を保持する.
   */
  public loading = true;

  /**
   * 入力されたメールアドレスを保持する.
   */
  private email = "";

  /**
   * 入力されたパスワードを保持する.
   */
  private password = "";

  /**
   * 認証エラーが発生したか否かを表す.
   */
  private isError = false;

  /**
   * エラーメッセージを保持する.
   */
  private errorMessage = "";

  /**
   * メールアドレス欄のバリデーションルールを取得する.
   */
  public get emailRules(): Array<Function> {
    return [
      (v: string) => !!v || "メールアドレスを入力してください",
    ];
  }

  /**
   * メールアドレス欄のバリデーションルールを取得する.
   */
  public get passwordRules(): Array<Function> {
    return [
      (v: string) => !!v || "パスワードを入力してください",
    ];
  }

  /**
   * リダイレクトされたか否かを取得する.
   */
  public get isRedirect(): boolean {
    return !!this.$route.query.isRedirect ?? false;
  }

  async mounted() {
    try {
      await this.redirectIfAuthenticated();
    } catch (e) {
      console.error(e);
      this.$notify.error("問題が発生しました");
      return;
    }

    this.loading = false;
  }

  /**
   * ユーザーが認証済みの場合に、リダイレクトを行う.
   */
  public async redirectIfAuthenticated(): Promise<void> {
    await this.$apiToken.actions.setUpToken();

    if (!this.$apiToken.getters.isApiTokenStored) {
      return;
    }

    try {
      await this.$apiToken.actions.verifyCrediantials();
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        return;
      }

      throw e;
    }

    this.$router.push({ name: routeNames.dashboard });
  }

  /**
   * ログインボタンのクリックイベントを処理する.
   */
  public async handleClickOnLoginButton(): Promise<void> {
    this.clearQuerys();

    if (!this.isValid()) {
      return;
    }

    this.clear();

    let success = true;

    try {
      await this.login();
    } catch (e) {
      success = false;

      if (e instanceof ClientError) {
        this.feedbackError("ログインに失敗しました、入力内容をご確認下さい");
      } else if (e instanceof ServerError) {
        this.$notify.error("サーバーで問題が発生しました");
      } else {
        this.$notify.error("問題が発生しました");
      }
    }

    if (success) {
      this.$router.push({ name: routeNames.dashboard });
    }
  }

  /**
   * ログイン処理を実施する.
   */
  public async login() {
    await this.$apiToken.actions.fetchApiToken({
      email: this.email,
      password: this.password
    });
  }

  /**
   * UIにエラーメッセージを通知する.
   *
   * @param message エラーメッセージ.
   */
  public feedbackError(message: string): void {
    this.errorMessage = message;
    this.isError = true;
  }

  /**
   * フォーム内の入力値が有効であるか取得する.
   *
   * @return
   *   フォーム内の入力値が有効であるか.
   */
  public isValid(): boolean {
    return this.form.validate();
  }

  /**
   * エラー関連のリソースを初期化する.
   */
  public clear(): void {
    this.errorMessage = "";
    this.isError = false;
  }

  /**
   * クエリを初期化する.
   */
  public clearQuerys(): void {
    /* eslint-disable arrow-body-style */
    /* eslint-disable @typescript-eslint/no-empty-function */
    this.$router.replace({ query: {} }, () => {});
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 50px;
}
.card {
  border: 1px solid rgba(0, 0, 0, 0.125) !important;
}
.card-title {
  font-size: 14.5px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.invalid-feedback {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #e3342f;
}
.label {
  font-size: 14.5px;
  font-weight: 400;
  margin-top: 10px;
}
</style>
