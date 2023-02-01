import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Task } from './task.model';
import { CycleTasksTemplates } from './cycle_task_templates.model';

@Table({ tableName: 'tasks_templates', timestamps: false })
export class TaskTemplate extends Model<TaskTemplate> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => CycleTasksTemplates)
  @Column({ type: DataType.INTEGER, allowNull: false })
  template_id: number;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: false })
  task_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  start_day: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  end_day: number;

  @BelongsTo(() => Task)
  task: Task;

  @BelongsTo(() => CycleTasksTemplates, { onDelete: 'cascade' })
  template: CycleTasksTemplates;
}
