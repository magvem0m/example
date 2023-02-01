export interface GetUserTasksByRoomsForMonthDto {
  uid: string;
  room_ids: number[];
  date: Date;
}
