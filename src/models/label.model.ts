import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Facility } from './facility.model';

@Table({ tableName: 'labels', timestamps: false })
export class Label extends Model<Label> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false, unique: 'unique_name_facility_id' })
  name: string;

  @ForeignKey(() => Facility)
  @Column({ type: DataType.INTEGER, unique: 'unique_name_facility_id' })
  facility_id: number;

  @BelongsTo(() => Facility)
  facility: Facility;
}
