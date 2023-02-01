export interface GetTasksByUser {
  uid: string;
  end_date?: Date;
  start_date?: Date;
  out?: boolean;
}
