import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Facility } from './models/facility.model';
import { RoomTicket } from './models/room_ticket.model';
import { Room } from './models/room.model';
import { Skill } from './models/skill.model';
import { User } from './models/user.model';
import { Widget } from './models/widget.model';
import { UserModule } from './modules/user/user.module';
import { RoomModule } from './modules/room/room.module';
import { Organization } from './models/organization.model';
import { Role } from './models/role.model';
import { OrganizationModule } from './modules/organization/organization.module';
import { FacilityModule } from './modules/facility/facility.module';
import { WidgetsSetup } from './models/widgets-setups.model';
import { WidgetModule } from './modules/widget/widget.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DistributorModule } from './modules/distributor/distributor.module';
import { RedisCacheModule } from './modules/redis-cache/redis-cache.module';
import { DateModule } from './modules/date/date.module';
import { Task } from './models/task.model';
import { TaskLog } from './models/task_log.model';
import { TaskModule } from './modules/task/task.module';
import { Log } from './models/logs.model';
import { LogModule } from './modules/log/log.module';
import { RoleModule } from './modules/role/role.module';
import { TeamModule } from './modules/team/team.module';
import { RoomType } from './models/room_type.model';
import { Label } from './models/label.model';
import { TaskLabels } from './models/task_labels.model';
import { TimeLog } from './models/timeLogs.model';
import { TeamRoom } from './models/team_room.model';
import { Team } from './models/team.model';
import { UserFacility } from './models/user_facility.model';
import { UserTeam } from './models/user_team.model';
import { WidgetType } from './models/widget_type.model';
import { TeamLabels } from './models/team_labels.model';
import { RoomStatus } from './models/room_statuses.model';
import { Alarm } from './models/alarm.model';
import { AlarmType } from './models/alarm_type.model';
import { RoomStatusType } from './models/room_status_types';
import { UtilsModule } from './modules/utils/utils.module';
import { AlarmModule } from './modules/alarm/alarm.module';
import { TaskTemplate } from './models/task_template.model';
import { CycleTasksTemplates } from './models/cycle_task_templates.model';
import { SummaryView } from './models/summary_page_view.model';
import { RoomModes } from './models/room_modes.model';
import { RoomModeTypes } from './models/room_mode_types.model';

@Module({
  imports: [
    ...(process.env.NODE_ENV !== 'production'
      ? [
          ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: join(__dirname, '..', '.env')
          })
        ]
      : []),
    ClientsModule.register([
      {
        name: 'PERMISSION_MICROSERVICE',
        transport: Transport.NATS,
        options: {
          servers: `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`,
          pass: process.env.BROKER_USER,
          user: process.env.BROKER_PASSWORD
        }
      }
    ]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      dialectOptions: {
        ssl: {
          ca: process.env.POSTGRES_CA
        }
      },
      pool: {
        max: 20,
        min: 10,
        acquire: 10000,
        idle: 300000
      },
      models: [
        CycleTasksTemplates,
        Room,
        Widget,
        Skill,
        User,
        Organization,
        Role,
        RoomModes,
        RoomModeTypes,
        WidgetsSetup,
        RoomTicket,
        SummaryView,
        Task,
        TaskTemplate,
        TaskLog,
        Log,
        RoomType,
        Label,
        TaskLabels,
        UserFacility,
        TimeLog,
        TeamRoom,
        Team,
        UserTeam,
        WidgetType,
        TeamLabels,
        RoomStatus,
        RoomStatusType,
        Alarm,
        AlarmType,
        Facility
      ]
      // autoLoadModels: true,
      // synchronize: true,
      // sync: {
      //   alter: true
      // }
    }),
    AlarmModule,
    UserModule,
    RoomModule,
    OrganizationModule,
    FacilityModule,
    WidgetModule,
    DistributorModule,
    RedisCacheModule,
    DateModule,
    TaskModule,
    LogModule,
    RoleModule,
    TeamModule,
    UtilsModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ClientsModule]
})
export class AppModule {}
