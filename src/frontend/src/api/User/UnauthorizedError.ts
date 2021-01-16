import { ApiError } from "@/api/exceptions";

/**
 * 未認証のの場合のエラー.
 */
export class UnauthorizedError extends ApiError {
  public name = "UnauthorizedError";
}
