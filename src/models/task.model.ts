import { Model, Table, Column, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Label } from './label.model';
import { Room } from './room.model';
import { TaskLabels } from './task_labels.model';
import { TaskLog } from './task_log.model';
import { User } from './user.model';
import { CycleTasksTemplates } from './cycle_task_templates.model';
import { TaskTemplate } from './task_template.model';

@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.TEXT })
  creator_uid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.TEXT })
  executor_uid: string;

  @ForeignKey(() => Room)
  @Column({ type: DataType.INTEGER, unique: 'name_room_id' })
  room_id: number;

  @Column({ type: DataType.TEXT, unique: 'name_room_id' })
  name: string;

  @Column({ type: DataType.INTEGER })
  phase: number;

  @Column({ type: DataType.INTEGER })
  status: number;

  @Column({ type: DataType.DATE, allowNull: false })
  start_date: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  end_date: Date;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  short_description: string;

  @Column({ type: DataType.TEXT })
  report: string;

  @Column({ type: DataType.INTEGER })
  color: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  review_needed: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  reschedule: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  high_priority: boolean;

  @BelongsTo(() => Room)
  room: Room;

  @HasMany(() => TaskLog)
  task_logs: TaskLog[];

  @BelongsToMany(() => Label, () => TaskLabels)
  labels: Label[];

  @BelongsToMany(() => CycleTasksTemplates, () => TaskTemplate)
  templates: CycleTasksTemplates[];

  cycle_start_day: number;
  cycle_end_day: number;
}
