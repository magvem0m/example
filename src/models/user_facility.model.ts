import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Facility } from './facility.model';
import { Role } from './role.model';
import { User } from './user.model';
import { SyncOptions } from 'sequelize/types';

@Table({ tableName: 'user_facilities', timestamps: false, indexes: [{ unique: true, fields: ['facility_id', 'pin'] }] })
export class UserFacility extends Model<UserFacility> {
  @ForeignKey(() => User)
  @Column({ type: DataType.TEXT })
  user_uid: string;

  @ForeignKey(() => Facility)
  @Column({ type: DataType.INTEGER })
  facility_id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  role_id: number;

  @Column({ type: DataType.TEXT })
  pin: string;

  @BelongsTo(() => Role)
  role: Role;

  static async sync(options: SyncOptions): Promise<any> {
    super.sync(options);
    if (options.alter) {
      this.sequelize.query(`ALTER TABLE "user_facilities" DROP CONSTRAINT IF EXISTS "user_facilities_user_uid_fkey"`);
      this.sequelize.query(
        `ALTER TABLE "user_facilities"  ADD FOREIGN KEY ("user_uid") REFERENCES "users" ("uid") ON DELETE SET NULL ON UPDATE CASCADE;`
      );
      this.sequelize.query(`ALTER TABLE "user_facilities" DROP CONSTRAINT IF EXISTS "user_facilities_facility_id_fkey"`);
      this.sequelize.query(
        `ALTER TABLE "user_facilities"  ADD FOREIGN KEY ("facility_id") REFERENCES "facilities" ("id") ON DELETE SET NULL ON UPDATE CASCADE;`
      );
    }
  }
}
