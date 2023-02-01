import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from './role.model';
import { Team } from './team.model';
import { User } from './user.model';
import { SyncOptions } from 'sequelize/types';

@Table({ tableName: 'user_team', timestamps: false })
export class UserTeam extends Model<UserTeam> {
  @ForeignKey(() => Team)
  @Column({ type: DataType.INTEGER })
  team_id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.TEXT })
  user_uid: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  role_id: number;

  @BelongsTo(() => Team, { onDelete: 'CASCADE' })
  team: Team;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => Role, { onDelete: 'SET NULL' })
  role: Role;

  static async sync(options: SyncOptions): Promise<any> {
    super.sync();
    if (options.alter) {
      this.sequelize.query(`ALTER TABLE "user_team" DROP CONSTRAINT IF EXISTS "user_team_user_uid_fkey";`);
      this.sequelize.query(
        `ALTER TABLE "user_team"  ADD FOREIGN KEY ("user_uid") REFERENCES "users" ("uid") ON DELETE CASCADE ON UPDATE CASCADE;`
      );
      this.sequelize.query(`ALTER TABLE "user_team" DROP CONSTRAINT IF EXISTS "user_team_team_id_fkey";`);
      this.sequelize.query(
        `ALTER TABLE "user_team"  ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id") ON DELETE CASCADE ON UPDATE CASCADE;`
      );
    }
  }
}
