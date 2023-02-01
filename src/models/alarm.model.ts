import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AlarmType } from './alarm_type.model';
import { Room } from './room.model';

@Table({ tableName: 'alarms', updatedAt: false })
export class Alarm extends Model<Alarm> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => AlarmType)
  @Column({ type: DataType.INTEGER })
  type_id: number;

  @ForeignKey(() => Room)
  @Column({ type: DataType.INTEGER })
  room_id: number;

  @Column({ type: DataType.SMALLINT })
  priority: number;

  @Column({ type: DataType.SMALLINT })
  signal: number;

  @BelongsTo(() => AlarmType)
  alarmType: AlarmType;

  @BelongsTo(() => Room)
  room: Room;
}
