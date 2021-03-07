import { Component } from "vue-property-decorator";
import { User } from "@/api/User";
import { ProfileGetResponse } from "@/api/User/types";
import { RedirectIfUnauthenticated } from "@/mixins/RedirectIfUnauthenticated";

export const redirectIfUnauthenticatedMock = jest.fn();

@Component
export class RedirectIfUnauthenticatedStub extends RedirectIfUnauthenticated {
  protected async redirectIfUnauthenticated(): Promise<boolean> {
    redirectIfUnauthenticatedMock();

    return false;
  }
}

export const redirectIfUnauthenticatedMockWithUnAuthed = jest.fn();

@Component
export class RedirectIfUnauthenticatedStubWithUnAuthed extends RedirectIfUnauthenticated {
  protected async redirectIfUnauthenticated(): Promise<boolean> {
    redirectIfUnauthenticatedMockWithUnAuthed();

    return true;
  }
}

export const redirectIfUnauthenticatedMockWithException = jest.fn();

@Component
export class RedirectIfUnauthenticatedStubWithException extends RedirectIfUnauthenticated {
  protected async redirectIfUnauthenticated(): Promise<boolean> {
    redirectIfUnauthenticatedMockWithException();

    throw new Error();
  }
}

export const getProfileMock = jest.fn();

export class UserMock extends User {
  public async getProfile(): Promise<ProfileGetResponse> {
    getProfileMock();

    return {
      name: "",
      email: ""
    };
  }
}

export const getProfileMockWithException = jest.fn();

export class UserMockWithException extends User {
  public async getProfile(): Promise<ProfileGetResponse> {
    getProfileMockWithException();

    throw new Error();
  }
}
