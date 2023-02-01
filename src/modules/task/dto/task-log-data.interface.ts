import { TaskActionTypes } from 'src/constants/task-action-types.constant';

export interface TaskLogData {
  type: TaskActionTypes;
  user: {
    uid: string;
    avatar: string;
    name: string;
  };
  field: string;
  old_value: any;
  new_value: any;
}
