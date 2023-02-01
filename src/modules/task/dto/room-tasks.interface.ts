import { Task } from 'src/models/task.model';

export interface RTasks {
  id: number;
  name: string;
  facility_id: number;
  options: any;
  tasks: Task[];
}
