import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import { container } from "@/providers/containers/api";
import { types } from "@/providers/types";
import { User } from "@/api/User";
import { ProfileUpdateParameters } from "@/api/User/types";
import { appendVApp } from "@/shared/vuetify";
import { waitUntilForMounted } from "@/shared/fixture";
import SettingForm from "@/pages/Profile/SettingForm.vue";
import { $notify, successNotifyMock, updateProfileMock, UserMock, updateProfileMockWithException, UserMockWithException, errorNotifyMock } from "./fixtures/SettingForm";

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("SettingForm.vue", () => {
  let vuetify = new Vuetify();

  beforeAll(() => {
    appendVApp();
  });

  beforeEach(() => {
    vuetify = new Vuetify();

    container.rebind<User>(types.api.User).to(UserMock);
  });

  afterEach(() => {
    updateProfileMock.mockReset();
  });

  it("初期表示時に各入力欄にデフォルト値が設定される", async () => {
    const settingForm = mount(SettingForm, {
      localVue,
      vuetify,
      propsData: {
        profile: {
          name: "username",
          email: "email@example.com"
        }
      }
    });

    await waitUntilForMounted();

    const username = (settingForm.find(".username input").element as HTMLInputElement).value;
    const email = (settingForm.find(".email input").element as HTMLInputElement).value;
    const password = (settingForm.find(".hidden-password input").element as HTMLInputElement).value;

    // profile Propに設定したユーザー名がユーザー名入力欄の値に設定される.
    expect(username).toBe("username");
    // pofile Propに設定したメールアドレスがメールアドレス入力欄の値に設定される.
    expect(email).toBe("email@example.com");
    // ダミーデータががパスワード入力欄の値に設定される.
    expect(password).not.toBe("");
  });

  it("ユーザー情報を入力し更新ボタンを押下すると、ユーザー情報更新処理が呼ばれる", async () => {
    const settingForm = mount(SettingForm, {
      localVue,
      vuetify,
      propsData: {
        profile: {
          name: "username",
          email: "email"
        }
      },
      mocks: {
        $notify
      }
    });

    await waitUntilForMounted();

    await settingForm.find(".username input").setValue("new-username");
    await settingForm.find(".email input").setValue("new-email@example.com");
    await settingForm.find(".hiddenPassword input").trigger("click");
    await settingForm.find(".passwordUpdateDialog .password input").setValue("password1!");
    await settingForm.find(".passwordUpdateDialog .save").trigger("click");
    await settingForm.find(".updateButton").trigger("click");

    const updateProfileParams: ProfileUpdateParameters = {
      username: "new-username",
      email: "new-email@example.com",
      password: "password1!"
    };

    const emitArguments = {
      name: "new-username",
      email: "new-email@example.com",
    };

    // ユーザー情報更新APIが呼ばれる.
    expect(updateProfileMock).toBeCalledWith(updateProfileParams);
    // profile Propを更新する命令が送出される.
    expect(settingForm.emitted("update:profile")).toEqual([[emitArguments]]);
    // 成功メッセージが通知される.
    expect(successNotifyMock).toBeCalled();
    expect(successNotifyMock.mock.calls[0][0]).not.toBe("");
  });

  it("入力欄に入力した値が制約に従わない場合、エラーメッセージが表示される", async () => {
    const settingForm = mount(SettingForm, {
      localVue,
      vuetify,
      propsData: {
        profile: {
          name: "username",
          email: "email"
        }
      }
    });

    await settingForm.find(".username input").setValue("");
    await settingForm.find(".email input").setValue("");
    await settingForm.find(".updateButton").trigger("click");

    // ユーザー名欄に空文字が入力された場合、エラーメッセージが表示されること.
    expect(settingForm.find(".username div[role=\"alert\"] .v-messages__message").text()).not.toBe("");
    // メールアドレス欄に空文字が入力された場合、エラーメッセージが表示されること.
    expect(settingForm.find(".email div[role=\"alert\"] .v-messages__message").text()).not.toBe("");
  });

  it("入力内容に不備がある場合、ユーザー情報更新処理は実施されない", async () => {
    const settingForm = mount(SettingForm, {
      localVue,
      vuetify,
      propsData: {
        profile: {
          name: "username",
          email: "email"
        }
      }
    });

    await settingForm.find(".username input").setValue("");
    await settingForm.find(".email input").setValue("");
    await settingForm.find(".updateButton").trigger("click");

    // ユーザー情報更新APIが呼ばれない.
    expect(updateProfileMock).not.toBeCalled();
  });

  describe("例外処理", () => {
    let stderrMock: jest.SpyInstance;

    beforeEach(() => {
      stderrMock = jest.spyOn(console, "error");
      stderrMock.mockImplementation(input => input);
    });

    afterEach(() => {
      updateProfileMockWithException.mockReset();
      stderrMock.mockReset();
      stderrMock.mockRestore();
    });

    it("ユーザー情報更新APIとの通信に失敗した場合、エラーメッセージが通知され、以降の処理は中断される", async () => {
      container.rebind<User>(types.api.User).to(UserMockWithException);

      const settingForm = mount(SettingForm, {
        localVue,
        vuetify,
        propsData: {
          profile: {
            name: "username",
            email: "email@example.com"
          }
        },
        mocks: {
          $notify
        }
      });

      await settingForm.find(".updateButton").trigger("click");

      expect(updateProfileMockWithException).toBeCalledWith({});
      expect(stderrMock).toBeCalled();
      expect(stderrMock.mock.calls[0][0]).not.toBe("");
      expect(errorNotifyMock).toBeCalled();
      expect(errorNotifyMock.mock.calls[0][0]).not.toBe("");
      // update:profile emit以降の処理は実施されない.
      expect(settingForm.emitted("update:profile")).toEqual(undefined);
    });
  });
});
