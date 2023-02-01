import { Task } from 'src/models/task.model';
import { User } from 'src/models/user.model';
import { UpdateTaskDto } from './update-task.dto';

export interface LogTaskDiffDto {
  dto: Omit<Partial<UpdateTaskDto>, 'labels'>;
  task: Task;
  user: User;
}
