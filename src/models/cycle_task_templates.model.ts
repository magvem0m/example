import { Model, Table, Column, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { Task } from './task.model';
import { Room } from './room.model';
import { TaskTemplate } from './task_template.model';

@Table({ tableName: 'cycle_tasks_templates', timestamps: false })
export class CycleTasksTemplates extends Model<CycleTasksTemplates> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false, unique: 'name_room_id' })
  name: string;

  @ForeignKey(() => Room)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: 'name_room_id' })
  room_id: number;

  @BelongsTo(() => Room, { onDelete: 'cascade' })
  room: Room;

  @BelongsToMany(() => Task, () => TaskTemplate)
  tasks: Task[];
}
