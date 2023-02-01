import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Alarm } from './alarm.model';

@Table({ tableName: 'alarm_type', timestamps: false })
export class AlarmType extends Model<AlarmType> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.TEXT, unique: true })
  name: string;

  @HasMany(() => Alarm)
  alarms: Alarm[];
}
