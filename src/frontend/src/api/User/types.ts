export type GetTasksResponse = {
  id: number;
  name: string;
}[];

export interface TaskCreateResponse {
  id: number;
  name: string;
}

export interface ProfileGetResponse {
  name: string;
  email: string;
}

export interface ProfileUpdateParameters {
  username?: string;
  email?: string;
  password?: string;
}

export interface ProfileUpdateResponse {
  username: string;
  email: string;
}
