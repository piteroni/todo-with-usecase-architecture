import { PasswordRule } from "@/pages/Profile/PasswordRule";
import { VTextRule } from "@/shared/vuetify";
import { testVTextRules } from "@/shared/fixture";

describe("PasswordRule.ts", () => {
  let passwordRules: VTextRule[];

  beforeEach(() => {
    passwordRules = new PasswordRule().passwordRules;
  });

  it("8文字以上半角英数字記号をそれぞれ含んだ文字列を渡すとtrueが返る", () => {
    expect(testVTextRules(passwordRules, "password1!")).toBe(true);
  });

  it("空文字を渡した場合エラーメッセージが返ってくる", () => {
    expect(typeof testVTextRules(passwordRules, "")).toBe("string");
    expect(testVTextRules(passwordRules, "")).not.toBe("");
  });

  it("8文字以下の文字列を入力した場合、エラー文が表示される.", () => {
    expect(typeof testVTextRules(passwordRules, "123")).toBe("string");
    expect(testVTextRules(passwordRules, "123")).not.toBe("");
  });

  it("英字が含まれていない文字列を入力した場合、エラー文が表示される", () => {
    expect(typeof testVTextRules(passwordRules, "~@19/3=%.;||")).toBe("string");
    expect(testVTextRules(passwordRules, "~@19/3=%.;||")).not.toBe("");
  });

  it("数字が含まれていない文字列を入力した場合、エラー文が表示される", () => {
    expect(typeof testVTextRules(passwordRules, "~password")).toBe("string");
    expect(testVTextRules(passwordRules, "~password")).not.toBe("");
  });

  it("記号が含まれていない文字列を入力した場合、エラー文が表示される", () => {
    expect(typeof testVTextRules(passwordRules, "1password")).toBe("string");
    expect(testVTextRules(passwordRules, "1password")).not.toBe("");
  });
});
