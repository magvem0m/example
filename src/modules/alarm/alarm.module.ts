import { forwardRef, Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from 'src/models/task.model';
import { Room } from 'src/models/room.model';
import { RoomStatus } from 'src/models/room_statuses.model';
import { Alarm } from 'src/models/alarm.model';
import { WidgetModule } from '../widget/widget.module';
import { AppModule } from 'src/app.module';

@Module({
  providers: [AlarmService],
  controllers: [AlarmController],
  imports: [forwardRef(() => WidgetModule), SequelizeModule.forFeature([Room, Task, RoomStatus, Alarm]), forwardRef(() => AppModule)],
  exports: [AlarmService]
})
export class AlarmModule {}
