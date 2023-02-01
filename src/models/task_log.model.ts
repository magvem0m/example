import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { TaskLogData } from 'src/modules/task/dto/task-log-data.interface';
import { Task } from './task.model';

@Table({ tableName: 'task_logs' })
export class TaskLog extends Model<TaskLog> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: false })
  task_id: number;

  @Column({ type: DataType.JSONB, allowNull: false })
  data: TaskLogData;

  @BelongsTo(() => Task)
  task: Task;
}
