import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Label } from './label.model';
import { Task } from './task.model';

@Table({ tableName: 'task_labels', timestamps: false })
export class TaskLabels extends Model<TaskLabels> {
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

  @ForeignKey(() => Label)
  @Column({ type: DataType.INTEGER, allowNull: false })
  labelId: number;

  @BelongsTo(() => Task, { onDelete: 'cascade' })
  task: Task;

  @BelongsTo(() => Label, { onDelete: 'cascade' })
  label: Label;
}
