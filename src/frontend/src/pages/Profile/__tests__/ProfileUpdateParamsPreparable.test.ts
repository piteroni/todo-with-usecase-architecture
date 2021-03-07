import { ProfileUpdateParameters } from "@/api/User/types";
import { ProfileUpdateParamsPreparable } from "@/pages/Profile/ProfileUpdateParamsPreparable";
import { InputValue, Profile } from "../types";

describe("ProfileUpdateParamsPreparable.ts", () => {
  let preparer: ProfileUpdateParamsPreparable;

  beforeEach(() => {
    preparer = new ProfileUpdateParamsPreparable();
  });

  it("ユーザー情報更新入力情報と更新前のユーザー情報を渡すと、差分に応じてユーザー情報更新パラメーターを取得できる", () => {
    const params: InputValue = {
      username: "new-username",
      email: "new-email@example.com",
      password: "new-password"
    };

    const profile: Profile = {
      name: "username",
      email: "email@example.com",
    };

    const expected: ProfileUpdateParameters = {
      username: "new-username",
      email: "new-email@example.com",
      password: "new-password"
    };

    const actual = preparer.prerpareProfileUpdateParams(params, profile);

    expect(expected).toEqual(actual);
  });

  it("ユーザー情報更新入力情報のユーザー名が更新されている場合、ユーザー名更新パラメーターを取得できる", () => {
    const params: InputValue = {
      username: "new-username",
      email: "email@example.com",
      password: ""
    };

    const profile: Profile = {
      name: "username",
      email: "email@example.com",
    };

    const expected: ProfileUpdateParameters = {
      username: "new-username",
    };

    const actual = preparer.prerpareProfileUpdateParams(params, profile);

    expect(expected).toEqual(actual);
  });

  it("ユーザー情報更新入力情報のメールアドレスが更新されている場合、メールアドレス更新パラメーターを取得できる", () => {
    const params: InputValue = {
      username: "username",
      email: "new-email@example.com",
      password: ""
    };

    const profile: Profile = {
      name: "username",
      email: "email@example.com",
    };

    const expected: ProfileUpdateParameters = {
      email: "new-email@example.com",
    };

    const actual = preparer.prerpareProfileUpdateParams(params, profile);

    expect(expected).toEqual(actual);
  });

  it("ユーザー情報更新入力情報のパスワードが更新されている場合、パスワード更新パラメーターを取得できる", () => {
    const params: InputValue = {
      username: "username",
      email: "email@example.com",
      password: "new-password"
    };

    const profile: Profile = {
      name: "username",
      email: "email@example.com",
    };

    const expected: ProfileUpdateParameters = {
      password: "new-password",
    };

    const actual = preparer.prerpareProfileUpdateParams(params, profile);

    expect(expected).toEqual(actual);
  });
});
