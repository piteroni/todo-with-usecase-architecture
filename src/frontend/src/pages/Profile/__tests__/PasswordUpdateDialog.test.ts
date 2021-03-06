import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import PasswordUpdateDialog from "@/pages/Profile/PasswordUpdateDialog.vue";
import { waitUntilForDone, waitUntilForMounted } from "@/shared/fixture";

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("PasswordUpdateDialog.vue", () => {
  let vuetify = new Vuetify();

  beforeAll(() => {
    const app = document.createElement("div");
    app.setAttribute("data-app", "true");
    document.body.append(app);
  });

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("isOpen Propの値がtrueの場合ダイアログが表示される", async () => {
    const passwordUpdateDialog = mount(PasswordUpdateDialog, {
      localVue,
      vuetify,
      propsData: {
        isOpen: true,
        passwordOrigin: ""
      }
    });

    await waitUntilForMounted();

    expect(passwordUpdateDialog.find(".passwordUpdateDialog").exists()).toBeTruthy();
  });

  it("isOpen Propの値がfalseの場合ダイアログは表示されない", async () => {
    const passwordUpdateDialog = mount(PasswordUpdateDialog, {
      localVue,
      vuetify,
      propsData: {
        isOpen: false,
        passwordOrigin: ""
      }
    });

    await waitUntilForMounted();

    expect(passwordUpdateDialog.find(".passwordUpdateDialog").exists()).toBeFalsy();
  });

  it("パスワード欄に入力した値が制約に従わない場合、エラーメッセージが表示される", async () => {
    const passwordUpdateDialog = mount(PasswordUpdateDialog, {
      localVue,
      vuetify,
      propsData: {
        isOpen: true,
        passwordOrigin: ""
      }
    });

    await waitUntilForMounted();

    const input = async (v: string): Promise<void> => {
      await passwordUpdateDialog.find(".password input").setValue(v);
      await passwordUpdateDialog.find(".save").trigger("click");

      await waitUntilForDone();
    }

    const alertText = (): string => passwordUpdateDialog.find(".password div[role=\"alert\"] .v-messages__message").text();

    await input("");

    const emptyValueAlertText = alertText();

    await input("123");

    const minLengthAlertText = alertText();

    const notFollowPolicyAlertTexts = [];

    await input("password");

    notFollowPolicyAlertTexts.push(alertText());

    await input("1password");

    notFollowPolicyAlertTexts.push(alertText());

    await input("~password");

    notFollowPolicyAlertTexts.push(alertText());

    await input("~@19/3=%.;||");

    notFollowPolicyAlertTexts.push(alertText());

    // 空文字を入力した場合、エラー文が表示される.
    expect(emptyValueAlertText).not.toBe("");
    // 8文字以下の文字列を入力した場合、エラー文が表示される.
    expect(minLengthAlertText).not.toBe("");
    // 数字記号が含まれていない文字列を入力した場合、エラー文が表示される.
    expect(notFollowPolicyAlertTexts[0]).not.toBe("");
    // 記号が含まれていない文字列を入力した場合、エラー文が表示される.
    expect(notFollowPolicyAlertTexts[1]).not.toBe("");
    // 数字が含まれていない文字列を入力した場合、エラー文が表示される.
    expect(notFollowPolicyAlertTexts[2]).not.toBe("");
    // 半角英字が含まれていない文字列を入力した場合、エラー文が表示される.
    expect(notFollowPolicyAlertTexts[3]).not.toBe("");
  });

  it("保存ボタンを押下した場合に、パスワードの保存処理が行われる", async () => {
    const passwordUpdateDialog = mount(PasswordUpdateDialog, {
      localVue,
      vuetify,
      propsData: {
        isOpen: true,
        passwordOrigin: ""
      }
    });

    await waitUntilForMounted();

    await passwordUpdateDialog.find(".password input").setValue("password1!");
    await passwordUpdateDialog.find(".save").trigger("click");

    // passwordOrigin Propをパスワード欄に入力した値に更新する命令が送出される.
    expect(passwordUpdateDialog.emitted("update:password-origin")).toEqual([["password1!"]]);
    // モーダルを閉じる命令が送出される.
    expect(passwordUpdateDialog.emitted("update:is-open")).toEqual([[false]]);
  });

  it("パスワード欄に制約に従わない値を入力し保存ボタンを押下すると、パスワードの保存処理が行われない", async () => {
    const passwordUpdateDialog = mount(PasswordUpdateDialog, {
      localVue,
      vuetify,
      propsData: {
        isOpen: true,
        passwordOrigin: ""
      }
    });

    await waitUntilForMounted();

    await passwordUpdateDialog.find(".password input").setValue("");
    await passwordUpdateDialog.find(".save").trigger("click");

    expect(passwordUpdateDialog.emitted("update:password-origin")).toBe(undefined);
    expect(passwordUpdateDialog.emitted("update:is-open")).toEqual(undefined);
  });

  it("キャンセルボタンを押下した場合に、パスワード保存のキャンセル処理が行われる", async () => {
    const passwordUpdateDialog = mount(PasswordUpdateDialog, {
      localVue,
      vuetify,
      propsData: {
        isOpen: true,
        passwordOrigin: "password-origin1!"
      }
    });

    await waitUntilForMounted();

    await passwordUpdateDialog.find(".password input").setValue("password1!");
    await passwordUpdateDialog.find(".cancel").trigger("click");

    // モーダルを閉じる命令が送出される.
    expect(passwordUpdateDialog.emitted("update:is-open")).toEqual([[false]]);
    // パスワード欄に入力された値は、passwordOrigin Propの値に更新される.
    expect((passwordUpdateDialog.find(".password input").element as HTMLInputElement).value).toEqual("password-origin1!");
  });

  it("パスワード入力欄にエラーがあった場合にキャンセルボタンを押下すると、エラーメッセージが初期化され表示されなくなる", async () => {
    const passwordUpdateDialog = mount(PasswordUpdateDialog, {
      localVue,
      vuetify,
      propsData: {
        isOpen: true,
        passwordOrigin: "password-origin1!"
      }
    });

    await waitUntilForMounted();

    await passwordUpdateDialog.find(".password input").setValue("");
    await passwordUpdateDialog.find(".cancel").trigger("click");

    await waitUntilForDone();

    expect(passwordUpdateDialog.find(".password div[role=\"alert\"]").exists()).toBeFalsy();
  });
});
