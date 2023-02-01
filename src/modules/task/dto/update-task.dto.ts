export interface UpdateTaskDto {
  task_id: number;
  room_id: number;
  executor_uid: string | null;
  updated_by_uid: string;
  team_id: number | null;
  labels: { id: number }[];
  name: string;
  phase: number;
  status: number;
  start_date: Date;
  end_date: Date;
  description: string;
  short_description: string | null;
  report: string | null;
  color: number;
  review_needed: boolean | null;
  reschedule: boolean | null;
  high_priority: boolean | null;
}
