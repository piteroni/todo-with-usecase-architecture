import { ApiError, ServerError, UnauthorizedError } from "@/api/exceptions";
import { TaskActions } from "@/store/modules/task";
import { ApiTokenActions, ApiTokenGetters } from "@/store/modules/apiToken";

export const verifyCrediantialsMock = jest.fn();

export class ApiTokenGettersMockWithAuthed extends ApiTokenGetters {
  public get isApiTokenStored() {
    return true;
  }
}

export class ApiTokenActionsMockWithAuthed extends ApiTokenActions {
  public async verifyCrediantials() {
    verifyCrediantialsMock();
  }
}

export class ApiTokenGettersMockWithUnauthed extends ApiTokenGetters {
  public get isApiTokenStored() {
    return false;
  }
}

export class ApiTokenActionsMockWithAuthFailure extends ApiTokenActions {
  public async verifyCrediantials() {
    verifyCrediantialsMock();
    throw new UnauthorizedError("unauthorized-error");
  }
}

export class ApiTokenActionsMockWithException extends ApiTokenActions {
  public async verifyCrediantials() {
    verifyCrediantialsMock();
    throw new ServerError("unauthorized-error");
  }
}

export const fetchTasksMockWithException = jest.fn();

export class TaskActionsMockWithException extends TaskActions {
  public async fetchTasks() {
    fetchTasksMockWithException();
    throw new ApiError("api-error");
  }
}
