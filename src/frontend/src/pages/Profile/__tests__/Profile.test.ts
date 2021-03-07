import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, shallowMount } from "@vue/test-utils";
import { types } from "@/providers/types";
import { container } from "@/providers/containers/api";
import { appendVApp } from "@/shared/vuetify";
import { User } from "@/api/User";
import { waitUntilForMounted } from "@/shared/fixture";
import Profile from "@/pages/Profile/Profile.vue";
import { getProfileMock, getProfileMockWithException, redirectIfUnauthenticatedMock, redirectIfUnauthenticatedMockWithException, redirectIfUnauthenticatedMockWithUnAuthed, RedirectIfUnauthenticatedStub, RedirectIfUnauthenticatedStubWithException, RedirectIfUnauthenticatedStubWithUnAuthed, UserMock, UserMockWithException } from "./fixtures/profile";

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("Profile.vue", () => {
  let vuetify = new Vuetify();

  beforeAll(() => {
    appendVApp();
  });

  beforeEach(() => {
    vuetify = new Vuetify();

    container.rebind<User>(types.api.User).to(UserMock);
  });

  afterEach(() => {
    getProfileMock.mockReset();
    redirectIfUnauthenticatedMock.mockReset();
    redirectIfUnauthenticatedMockWithUnAuthed.mockReset();
  });

  it("初期画面表示時にローディング画面が表示される", () => {
    const profile = shallowMount(Profile, {
      localVue,
      vuetify,
      mixins: [
        RedirectIfUnauthenticatedStub
      ]
    });

    // mountedが完了すると、テストは失敗する.
    expect(redirectIfUnauthenticatedMock).toBeCalled();
    expect(profile.find("loading-stub").exists()).toBeTruthy();
    expect(profile.find(".profile").exists()).toBeFalsy();
  });

  it("ユーザーの資格情報が有効であるかつ、ユーザー情報の取得処理が完了すると、ダッシュボード画面が表示される", async () => {
    const profile = shallowMount(Profile, {
      localVue,
      vuetify,
      mixins: [
        RedirectIfUnauthenticatedStub
      ]
    });

    await waitUntilForMounted();

    expect(redirectIfUnauthenticatedMock).toBeCalled();
    expect(getProfileMock).toBeCalled();
    expect(profile.find(".profile").exists()).toBeTruthy();
  });

  it("ユーザーの資格情報が無効な場合、リダイレクトが行われユーザー情報の取得処理が行われない", async () => {
    shallowMount(Profile, {
      localVue,
      vuetify,
      mixins: [
        RedirectIfUnauthenticatedStubWithUnAuthed
      ]
    });

    await waitUntilForMounted();

    expect(redirectIfUnauthenticatedMockWithUnAuthed).toBeCalled();
    expect(getProfileMock).not.toBeCalled();
  });

  describe("例外ハンドリング", () => {
    let stderrMock: jest.SpyInstance;
    let errorNotifyMock: jest.Mock;
    let $notify: Record<string, jest.Mock>;

    beforeEach(() => {
      stderrMock = jest.spyOn(console, "error");
      stderrMock.mockImplementation(input => input);

      errorNotifyMock = jest.fn();
      $notify = {
        error: errorNotifyMock
      };
    });

    afterEach(() => {
      redirectIfUnauthenticatedMockWithException.mockReset();
      getProfileMockWithException.mockReset();
      errorNotifyMock.mockReset();
      stderrMock.mockReset();
      stderrMock.mockRestore();
    });

    it("ユーザーの資格情報検証処理中に例外が発生した場合に、エラーメッセージが通知される", async () => {
      shallowMount(Profile, {
        localVue,
        vuetify,
        mocks: {
          $notify
        },
        mixins: [
          RedirectIfUnauthenticatedStubWithException
        ]
      });

      await waitUntilForMounted();

      expect(redirectIfUnauthenticatedMockWithException).toBeCalled();
      expect(stderrMock).toBeCalled();
      expect(stderrMock.mock.calls[0][0]).not.toBe("");
      expect(errorNotifyMock).toBeCalled();
      expect(errorNotifyMock.mock.calls[0][0]).not.toBe("");
    });

    it("ユーザー情報取得処理中に例外が発生した場合に、エラーメッセージが通知される", async () => {
      container.rebind<User>(types.api.User).to(UserMockWithException);

      shallowMount(Profile, {
        localVue,
        vuetify,
        mocks: {
          $notify
        },
        mixins: [
          RedirectIfUnauthenticatedStub
        ]
      });

      await waitUntilForMounted();

      expect(getProfileMockWithException).toBeCalled();
      expect(stderrMock).toBeCalled();
      expect(stderrMock.mock.calls[0][0]).not.toBe("");
      expect(errorNotifyMock).toBeCalled();
      expect(errorNotifyMock.mock.calls[0][0]).not.toBe("");
    });
  });
});
