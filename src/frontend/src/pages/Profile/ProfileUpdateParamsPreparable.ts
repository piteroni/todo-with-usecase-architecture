import { ProfileUpdateParameters } from "@/api/User/types";
import { Vue, Component } from "vue-property-decorator";
import { InputValue, Profile } from "./types";

@Component
export class ProfileUpdateParamsPreparable extends Vue {
  /**
   * ユーザー情報更新パラメーターを取得する.
   *
   * @param inputs
   *   ユーザー情報更新入力情報.
   * @param origin
   *   更新前のユーザー情報.
   * @returns
   *   ユーザー情報更新パラメーター.
   */
  public prerpareProfileUpdateParams(inputs: InputValue, origin: Profile): ProfileUpdateParameters {
    const params: ProfileUpdateParameters = {};

    if (inputs.username !== origin.name) {
      params.username = inputs.username;
    }

    if (inputs.email !== origin.email) {
      params.email = inputs.email;
    }

    if (inputs.password !== "") {
      params.password = inputs.password;
    }

    return params;
  }
}
