import { Model, Table, Column, DataType, ForeignKey, HasMany, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { TeamRoom } from './team_room.model';
import { Facility } from './facility.model';
import { Task } from './task.model';
import { RoomType } from './room_type.model';
import { Team } from './team.model';
import { RoomStatus } from './room_statuses.model';
import { Alarm } from './alarm.model';
import { WidgetsSetup } from './widgets-setups.model';
import { RoomModes } from './room_modes.model';

@Table({ tableName: 'rooms' })
export class Room extends Model<Room> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  name: string;

  @ForeignKey(() => Facility)
  @Column({ type: DataType.INTEGER, allowNull: false })
  facility_id: number;

  @Column({ type: DataType.TEXT, defaultValue: '' })
  icon: string;

  @Column({ type: DataType.TEXT, defaultValue: '' })
  ipadIcon: string;

  @ForeignKey(() => RoomType)
  @Column({ type: DataType.INTEGER })
  typeId: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  currentDay: number;

  @Column({ type: DataType.JSONB })
  params: string;

  @ForeignKey(() => WidgetsSetup)
  @Column({ type: DataType.INTEGER })
  widget_id: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_cycle: boolean;

  @BelongsTo(() => RoomType)
  type: RoomType;

  @BelongsTo(() => Facility)
  facility: Facility;

  @BelongsToMany(() => Team, () => TeamRoom)
  teams: Team[];

  @HasMany(() => Task)
  tasks: Task[];

  @HasMany(() => Alarm, { as: 'Alarm' })
  alarms: Alarm[];

  @HasMany(() => RoomStatus)
  roomStatuses: RoomStatus[];

  @HasMany(() => RoomModes)
  roomModes: RoomModes[];

  @BelongsTo(() => WidgetsSetup)
  widgetSetup: WidgetsSetup;
}
