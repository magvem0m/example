export interface CreateTaskDto {
  creator_uid: string;
  executor_uid?: string;
  room_id: number;
  team_id?: number;
  labels?: number[];
  name?: string;
  phase?: number;
  status?: number;
  start_date?: Date;
  end_date?: Date;
  description?: string;
  report?: string;
  short_description?: string;
  color?: number;
  review_needed?: boolean;
  reschedule?: boolean;
  high_priority?: boolean;
}
