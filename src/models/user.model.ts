import { Model, Table, Column, DataType, HasMany, HasOne, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Organization } from './organization.model';
import { Facility } from './facility.model';
import { Team } from './team.model';
import { UserFacility } from './user_facility.model';
import { UserTeam } from './user_team.model';
import { Role } from './role.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.TEXT,
    unique: true,
    primaryKey: true
  })
  uid: string;

  @Column({ type: DataType.TEXT })
  name: string;

  @Column({ type: DataType.TEXT })
  phone: string | undefined;

  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.TEXT })
  avatar_path: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  telegram_id: number;

  @ForeignKey(() => Organization)
  @Column({ type: DataType.INTEGER })
  organization_id: number;

  @BelongsTo(() => Organization)
  organization: Organization;

  @BelongsToMany(() => Facility, () => UserFacility)
  facilities: Facility[];

  @BelongsToMany(() => Team, () => UserTeam)
  teams: Team[];

  @HasMany(() => UserTeam)
  user_team: UserTeam[];

  @HasMany(() => UserFacility)
  user_facility: UserFacility[];
  UserFacility: any;
}
