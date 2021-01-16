import { PostLoginResponse } from "@/api/Identification/types";

export const loginReturnValue = "qilW4Qx27iVjJiK2WOw1KBDN9EC9nJNfeCKfzkDQoC9V5roXfQVVpZyZycdO";

export const login = async (): Promise<PostLoginResponse> => ({
  apiToken: loginReturnValue
});
