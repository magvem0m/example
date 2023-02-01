import { Controller, HttpException, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AlarmService } from './alarm.service';
import { ExceptionFilterMs } from 'src/filters/controller-exception.filter';

@UseFilters(new ExceptionFilterMs())
@Controller('alarm')
export class AlarmController {
  constructor(private alarmService: AlarmService) {}

  @MessagePattern('get-alarms-by-rooms')
  async getAlarmsByRooms(rooms_ids: number[]) {
      return await this.alarmService.getAlarmsByRooms(rooms_ids);
  }
}
