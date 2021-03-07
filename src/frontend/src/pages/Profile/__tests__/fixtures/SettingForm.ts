import { User } from "@/api/User";
import { ProfileUpdateParameters, ProfileUpdateResponse } from "@/api/User/types";

export const updateProfileMock = jest.fn();

export class UserMock extends User {
  public async updateProfile(params: ProfileUpdateParameters): Promise<ProfileUpdateResponse> {
    updateProfileMock(params);

    return {
      username: params.username ?? "",
      email: params.email ?? ""
    };
  }
}

export const updateProfileMockWithException = jest.fn();

export class UserMockWithException extends User {
  public async updateProfile(params: ProfileUpdateParameters): Promise<ProfileUpdateResponse> {
    updateProfileMockWithException(params);

    throw new Error();
  }
}

export const successNotifyMock = jest.fn();

export const errorNotifyMock = jest.fn();

export const $notify = {
  success: (message: string) => successNotifyMock(message),
  error: (message: string) => errorNotifyMock(message),
};
