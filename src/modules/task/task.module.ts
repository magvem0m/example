import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskLog } from 'src/models/task_log.model';
import { Task } from 'src/models/task.model';
import { UserModule } from '../user/user.module';
import { AppModule } from 'src/app.module';
import { Room } from 'src/models/room.model';
import { DateModule } from '../date/date.module';
import { Label } from 'src/models/label.model';
import { RoomModule } from '../room/room.module';
import { TaskTemplate } from 'src/models/task_template.model';
import { CycleTasksTemplates } from 'src/models/cycle_task_templates.model';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AppModule),
    forwardRef(() => DateModule),
    forwardRef(() => RoomModule),
    SequelizeModule.forFeature([Task, TaskLog, Room, Label, TaskTemplate, CycleTasksTemplates]),
    ClientsModule.register([
      {
        name: 'DISTRIBUTOR_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: `${process.env.BROKER_HOST}:${process.env.BROKER_PORT}`,
          pass: process.env.BROKER_USER,
          user: process.env.BROKER_PASSWORD
        }
      }
    ])
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService]
})
export class TaskModule {}
