/* eslint-disable no-mixed-operators */
import { Vue, Component } from "vue-property-decorator";
import { VTextRule, required as requiredbase } from "@/shared/vuetify";

/**
 * 値が入力されていることを期待する.
 */
const required: VTextRule = (v: string | undefined) => requiredbase(v, "パスワードを入力してください");

/**
 * 入力された文字列の長さが閾値以上であることを期待する.
 */
const minLength: VTextRule = (v: string | undefined) => !!v && v.length >= 8 || "パスワードは最低8文字以上入力してください";

/**
 * パスワードを構成する文字列に関する正規表現を取得する.
 */
const passwordRegularExpresion = (): RegExp => /^(?=.*?[a-z])(?=.*?\d)(?=.*?[!-/:-@[-`{-~])[!-~]{0,}$/i;

/**
 * 入力された文字列が指定文字を含んでいることを期待する.
 */
const policy: VTextRule = (v: string | undefined) => !!v && passwordRegularExpresion().test(v) || "半角英数字記号をそれぞれ1種類以上含めてください";

@Component
export class PasswordRule extends Vue {
  /**
   * パスワード欄のバリデーションルールを取得する.
   */
  public get passwordRules(): VTextRule[] {
    return [
      required,
      minLength,
      policy
    ];
  }
}
