import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import PasswordUpdateDialog from "@/pages/Profile/PasswordUpdateDialog.vue";
import { waitUntilForDone, waitUntilForMounted } from "@/shared/fixture";
import { appendVApp } from "@/shared/vuetify";
import { passwordRuleMock, PasswordRuleWithError } from "./fixtures/passwordUpdateDialog";

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("PasswordUpdateDialog.vue", () => {
  let vuetify = new Vuetify();

  beforeAll(() => {
    appendVApp();
  });

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  afterEach(() => {
    passwordRuleMock.mockClear();
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
      },
      mixins: [
        PasswordRuleWithError
      ]
    });

    await waitUntilForMounted();

    await passwordUpdateDialog.find(".password input").setValue("");
    await passwordUpdateDialog.find(".save").trigger("click");

    await waitUntilForDone();

    expect(passwordRuleMock).toBeCalled();
    expect(passwordUpdateDialog.find(".password div[role=\"alert\"] .v-messages__message").text()).toBe("validation-error");
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
      },
      mixins: [
        PasswordRuleWithError
      ]
    });

    await waitUntilForMounted();

    await passwordUpdateDialog.find(".password input").setValue("");
    await passwordUpdateDialog.find(".save").trigger("click");

    expect(passwordRuleMock).toBeCalled();
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
      },
      mixins: [
        PasswordRuleWithError
      ]
    });

    await waitUntilForMounted();

    await passwordUpdateDialog.find(".password input").setValue("");
    await passwordUpdateDialog.find(".cancel").trigger("click");

    await waitUntilForDone();

    expect(passwordRuleMock).toBeCalled();
    expect(passwordUpdateDialog.find(".password div[role=\"alert\"]").exists()).toBeFalsy();
  });
});
