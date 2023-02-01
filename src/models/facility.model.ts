import { Model, Table, Column, DataType, HasMany, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from './role.model';
import { Room } from './room.model';
import { Team } from './team.model';
import { User } from './user.model';
import { UserFacility } from './user_facility.model';
import { WidgetsSetup } from './widgets-setups.model';

@Table({ tableName: 'facilities' })
export class Facility extends Model<Facility> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  timezone: string;

  @Column({ type: DataType.TEXT })
  location: string;

  @ForeignKey(() => WidgetsSetup)
  @Column({ type: DataType.INTEGER })
  widget_id: number;

  @HasMany(() => Room)
  rooms: Room[];

  @HasMany(() => Role)
  roles: Role[];

  @BelongsToMany(() => User, () => UserFacility)
  users: User[];

  @BelongsTo(() => WidgetsSetup)
  widgetSetup: WidgetsSetup;

  @HasMany(() => Team)
  teams: Team[];

  @HasMany(() => UserFacility)
  users_facility: UserFacility[];
}
