import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Label } from './label.model';
import { Team } from './team.model';

@Table({ tableName: 'team_labels', timestamps: false })
export class TeamLabels extends Model<TeamLabels> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER, allowNull: false })
  team_id: number;

  @ForeignKey(() => Label)
  @Column({ type: DataType.INTEGER, allowNull: false })
  labelId: number;

  @BelongsTo(() => Team, { onDelete: 'cascade' })
  team: Team;

  @BelongsTo(() => Label, { onDelete: 'cascade' })
  label: Label;
  name: any;
}
