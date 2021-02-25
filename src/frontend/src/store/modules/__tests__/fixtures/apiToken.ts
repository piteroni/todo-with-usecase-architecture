import { Identification } from "@/api/Identification";

export const loginMock = jest.fn();
export class IdentificationMock extends Identification {
  public async login(email: string, password: string) {
    loginMock(email, password);

    return {
      apiToken: "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdO"
    };
  }
}
