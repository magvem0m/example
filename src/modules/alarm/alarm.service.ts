import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Alarm } from 'src/models/alarm.model';
import sequelize, { Op } from 'sequelize';
import { AlarmType } from 'src/models/alarm_type.model';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Alarms_Types } from './references/alarms_types';

@Injectable()
export class AlarmService {
  constructor(
    @InjectModel(Alarm)
    private alarmRepository: typeof Alarm,
    @Inject('PERMISSION_MICROSERVICE') private permissionClient: ClientProxy
  ) {}

  async getAlarmsByRooms(rooms_ids: number[]) {
    try {
      const alarms = await this.alarmRepository.findAll({
        where: {
          room_id: rooms_ids,
          type_id: { [Op.lte]: 4 },
          createdAt: sequelize.literal(
            `"Alarm"."createdAt" = (SELECT MAX("createdAt") FROM alarms as "maxAlarms" WHERE "Alarm"."room_id"="maxAlarms"."room_id" GROUP BY "room_id")`
          )
        },
        include: {
          model: AlarmType,
          attributes: []
        },
        attributes: ['id', 'room_id', 'type_id', [sequelize.col('alarmType.name'), 'type_name'], 'priority', 'signal']
      });

      const serAlarms = new Map<
        number,
        { type: 'alarm-data'; room_id: number; room_name: string; data: { type_id: number; type_name: string; importance: string }[] }
      >();

      const alarmsProm = alarms.map(async (alarm) => {
        let roomMap = serAlarms.get(alarm.room_id);

        if (roomMap) roomMap.data.push({ type_id: alarm.type_id, ...Alarms_Types.get(alarm.type_id) });
        else
          roomMap = {
            type: 'alarm-data',
            room_id: alarm.room_id,
            room_name: (await lastValueFrom(this.permissionClient.send('get-room-per', alarm.room_id))).name,
            data: [{ type_id: alarm.type_id, ...Alarms_Types.get(alarm.type_id) }]
          };

        serAlarms.set(alarm.room_id, roomMap);
      });

      await Promise.all(alarmsProm);

      return Array.from(serAlarms).map((arr) => arr[1]);
    } catch (err) {
      console.log(err);
      return [];
    }
  }//My code
}
