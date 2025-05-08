export interface ServerResponse<T> {
  status: number;
  msg: string;
  data: T;
}
