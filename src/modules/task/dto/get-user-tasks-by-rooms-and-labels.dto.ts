export interface GetUserTasksByRoomsAndLabelsDto {
  uid: string;
  rooms: number[];
  out?: boolean;
  labels?: number[];
  end_date?: Date;
  start_date?: Date;
}
