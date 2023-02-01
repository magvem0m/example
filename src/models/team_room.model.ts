import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Room } from './room.model';
import { Team } from './team.model';

@Table({ tableName: 'team_rooms', timestamps: false })
export class TeamRoom extends Model<TeamRoom> {
  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER })
  team_id: number;

  @ForeignKey(() => Room)
  @Column({ type: DataType.INTEGER })
  room_id: number;

  @BelongsTo(() => Team, { onDelete: 'cascade' })
  team: Team;

  @BelongsTo(() => Room, { onDelete: 'cascade' })
  room: Room;
}
