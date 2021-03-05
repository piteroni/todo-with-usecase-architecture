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

export interface ProfileUpdateResponse {
  name: string;
  email: string;
}
