import { Model, Table, Column, DataType, BelongsTo, ForeignKey, HasMany, BelongsToMany, HasOne } from 'sequelize-typescript';
import { Facility } from './facility.model';
import { Label } from './label.model';
import { Room } from './room.model';
import { Task } from './task.model';
import { TeamLabels } from './team_labels.model';
import { TeamRoom } from './team_room.model';
import { User } from './user.model';
import { UserTeam } from './user_team.model';

@Table({ tableName: 'teams' })
export class Team extends Model<Team> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false,  })
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  avatar_path: string;

  @ForeignKey(() => Facility)
  @Column({ type: DataType.INTEGER })
  facility_id: number;

  @BelongsTo(() => Facility)
  facility: Facility;

  @BelongsToMany(() => Room, () => TeamRoom)
  rooms: Room[];

  @BelongsToMany(() => Label, () => TeamLabels)
  labels: Label[];

  @BelongsToMany(() => User, () => UserTeam)
  users: User[];

  @HasMany(() => UserTeam)
  team_users: UserTeam[];

  role_id: number;
  dataValues: any;
}
