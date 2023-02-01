import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Room } from 'src/models/room.model';
import { TaskActionTypes } from '../../constants/task-action-types.constant';
import { TaskLog } from '../../models/task_log.model';
import { Task } from '../../models/task.model';
import { AddTaskLogDto } from '../room/dto/add-task-log.dto';
import { UserService } from '../user/user.service';
import { Label } from 'src/models/label.model';
import { lastValueFrom } from 'rxjs';
import sequelize from 'sequelize';
import { RoomService } from '../room/room.service';
import { Facility } from 'src/models/facility.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { PermissionFacilities } from '../facility/dto/permission-facilities.interface';
import { AllOptions } from 'src/constants/options-list';
import { LabelUserTasksDto } from './dto/label-user-tasks.dto';
import { LogTaskDiffDto } from './dto/log-task-diff.dto';
import { TaskTemplate } from 'src/models/task_template.model';
import { CycleTasksTemplates } from 'src/models/cycle_task_templates.model';
import * as dayjs from 'dayjs';
import { RTasks } from './dto/room-tasks.interface';
import { TaskLogData } from './dto/task-log-data.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { OwnUserTasksDto } from './dto/own-user-tasks.dto';
import { GetUserTasksByRoomsForMonthDto } from './dto/get-user-tasks-by-rooms.dto';
import { GetUserTasksByRoomsAndLabelsDto } from './dto/get-user-tasks-by-rooms-and-labels.dto';
import { GetTasksByUser } from './dto/get-tasks-by-user.dto';
import { GetTasksByFacility } from './dto/get-tasks-by-facility.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TaskLog)
    private taskLogRepository: typeof TaskLog,

    @InjectModel(Task)
    private taskRepository: typeof Task,

    @InjectModel(TaskTemplate)
    private taskTemplateRepository: typeof TaskTemplate,

    @InjectModel(CycleTasksTemplates)
    private cycleTasksTemplatesRepository: typeof CycleTasksTemplates,

    @InjectModel(Label)
    private labelRepository: typeof Label,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,

    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,

    @Inject('PERMISSION_MICROSERVICE') private permissionClient: ClientProxy
  ) {}

  async isTaskExist(taskId: number): Promise<boolean> {
    return await this.taskRepository.findByPk(taskId).then((task) => task !== null);
  }

  async deleteTask(task_id: number) {
    const transaction = await this.taskLogRepository.sequelize.transaction();
    try {
      const [destroyedTask, destroyedLog] = await Promise.all([
        this.taskRepository.destroy({ where: { id: task_id }, transaction }),
        this.taskLogRepository.destroy({ where: { task_id }, transaction })
      ]);

      await transaction.commit();

      return destroyedTask ? 'Task has been deleted!' : 'Cant delete this task...';
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }//My code

  async getTasksByUser({ uid, end_date, start_date, out }: GetTasksByUser) {
    const {rooms, labels} = await this.getRoomsAndLabelsByUser({uid});

    return await this.getUserTasksByRoomsAndLabels({ uid, rooms, out, labels, end_date, start_date });
  }//My code

  async getTasksByRoomsAndUser({
    uid,
    room_ids,
    start_date,
    end_date
  }: {
    room_ids: number[];
    uid: string;
    start_date?: Date;
    end_date?: Date;
  }) {
    const {rooms, labels} = await this.getRoomsAndLabelsByUser({uid, room_ids});

    return await this.getUserTasksByRoomsAndLabels({
      uid,
      rooms,
      labels,
      out: false,
      start_date: start_date ? start_date : new Date('2000-12-26T23:59:59.432Z'),
      end_date: end_date ? end_date : new Date('2100-12-26T23:59:59.432Z')
    });
  }

  async getTasksForCalendar({ date, uid, room_ids }: { uid: string; room_ids: number[]; date?: Date }) {
    const {rooms, labels} = await this.getRoomsAndLabelsByUser({uid, room_ids});
    return date
      ? this.getTasksByMonthAndLabelsAndRooms({ uid, rooms, labels, date: new Date(date) })
      : this.getTasksByCurrentCycleAndLabelsAndRooms({ uid, rooms, labels });
  } // My code

  async getTasksByRoomsAndUserForMonth({ uid, date, room_ids }: GetUserTasksByRoomsForMonthDto) {
      const {rooms, labels} = await this.getRoomsAndLabelsByUser({uid, room_ids});
      return await this.getUserTasksByRoomsAndLabelsForMonth({ uid, rooms_ids: rooms, labels, date });
  }//My code

  async getTasksByCurrentCycleAndLabelsAndRooms({ rooms, labels, uid }: GetUserTasksByRoomsAndLabelsDto) {
    const tasks = (
      await this.taskRepository.findAll({
        where: {
          room_id: rooms,
          [Op.or]: [
            { executor_uid: uid },
            { creator_uid: uid },
            sequelize.where(sequelize.col('labels.id'), labels?.length ? { [Op.any]: labels } : { [Op.ne]: -1 })
          ],
          start_date: { [Op.gte]: sequelize.literal(`NOW()::DATE-"room"."currentDay"`) }
        },
        include: [
          {
            model: Room,
            as: 'room',
            attributes: []
          },
          {
            model: Label,
            required: false,
            attributes: [],
            through: {
              attributes: []
            }
          },
          {
            model: TaskLog,
            limit: 50,
            where: {
              data: {
                field: {
                  [Op.any]: ['status', 'report', 'executor_uid']
                }
              }
            },
            through: {
              attributes: []
            }
          }
        ]
      })
    ).map((task) => ({
      ...task.toJSON(),
      start_date: dayjs(new Date(task.start_date)).format('YYYY/MM/DD'),
      end_date: dayjs(new Date(task.end_date)).format('YYYY/MM/DD')
    }));

    return tasks;
  }

  async getTasksByMonthAndLabelsAndRooms({ rooms, labels, uid, date }: { rooms: number[]; labels: number[]; uid: string; date: Date }) {
    if (typeof date == 'string') date = new Date(date);

    const tasks = await this.taskRepository.findAll({
      where: {
        room_id: rooms,
        [Op.or]: [
          { executor_uid: uid },
          { creator_uid: uid },
          sequelize.where(sequelize.col('labels.id'), labels?.length ? { [Op.any]: labels } : { [Op.ne]: -1 })
        ],
        [Op.or]: [
          {
            [Op.and]: [
              sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('start_date')), '=', date.getMonth() + 1),
              sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('start_date')), '=', date.getFullYear())
            ]
          },
          {
            [Op.and]: [
              sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('end_date')), '=', date.getMonth() + 1),
              sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('end_date')), '=', date.getFullYear())
            ]
          }
        ]
      },
      include: [
        {
          model: Room,
          as: 'room',
          attributes: []
        },
        {
          model: Label,
          required: false,
          attributes: ['id', 'name'],
          through: {
            attributes: []
          }
        },
        {
          model: TaskLog,
          limit: 50,
          where: {
            data: {
              field: {
                [Op.any]: ['status', 'report', 'executor_uid']
              }
            }
          },
          through: {
            attributes: []
          }
        }
      ]
    });

    return tasks;
  }//My code

  async getOverdueTasksByRooms(rooms_ids: number[]) {
    return await this.taskRepository.findAll({
      where: {
        room_id: rooms_ids,
        end_date: {
          [Op.lte]: new Date()
        },
        status: {
          [Op.ne]: 9
        }
      },
      attributes: ['room_id', 'id']
    });
  }//My code

  async getUserTasksByRoomsAndLabels({ uid, rooms, out, labels, end_date, start_date }: GetUserTasksByRoomsAndLabelsDto) {// "out" means in or out of period
    const endDate = end_date ? end_date : new Date();
    const startDate = start_date ? start_date : new Date();
    const OpGte = { [Op.gte]: out != false ? endDate : startDate };
    const OpLte = { [Op.lte]: out != false ? startDate : endDate };
    const tasks = await this.taskRepository.findAll({
      where: {
        room_id: rooms,
        [Op.or]: [
          { executor_uid: uid },
          { creator_uid: uid },
          sequelize.where(sequelize.col('labels.id'), labels?.length ? { [Op.any]: labels } : { [Op.ne]: -1 })
        ],
        end_date: OpGte,
        [Op.and]: [{ start_date: OpLte }, { start_date: { [Op.gte]: sequelize.literal(`NOW()::DATE-"room"."currentDay"`) } }]
      },
      include: [
        {
          model: Room,
          as: 'room'
        },
        {
          model: Label,
          required: false,
          through: {
            attributes: []
          }
        },
        {
          model: TaskLog,
          limit: 50,
          where: {
            data: {
              field: {
                [Op.any]: ['status', 'report', 'executor_uid']
              }
            }
          },
          through: {
            attributes: []
          }
        }
      ]
    });

    return tasks;
  }//My code

  async getUserTasksByRoomsAndLabelsForMonth({
    uid,
    rooms_ids,
    labels,
    date
  }: {
    uid: string;
    rooms_ids: number[];
    labels: number[];
    date: Date;
  }) {
    date = new Date(date);
    const tasks = await this.taskRepository.findAll({
      where: {
        room_id: rooms_ids,
        [Op.or]: [
          { executor_uid: uid },
          { creator_uid: uid },
          sequelize.where(sequelize.col('labels.id'), labels?.length ? { [Op.any]: labels } : { [Op.ne]: -1 })
        ],
        [Op.and]: [
          {
            [Op.or]: [
              {
                [Op.and]: [
                  sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('start_date')), '=', date.getMonth() + 1),
                  sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('start_date')), '=', date.getFullYear())
                ]
              },
              {
                [Op.and]: [
                  sequelize.where(sequelize.fn('date_part', 'month', sequelize.col('end_date')), '=', date.getMonth() + 1),
                  sequelize.where(sequelize.fn('date_part', 'year', sequelize.col('end_date')), '=', date.getFullYear())
                ]
              }
            ]
          },
          { start_date: { [Op.gte]: sequelize.literal(`NOW()::DATE-"room"."currentDay"`) } }
        ]
      },
      include: [
        {
          model: Room,
          as: 'room',
          attributes: ['id', 'name', 'currentDay']
        },
        {
          model: Label,
          required: false,
          through: {
            attributes: []
          }
        },
        {
          model: TaskLog,
          limit: 50,
          where: {
            data: {
              field: {
                [Op.any]: ['status', 'report', 'executor_uid']
              }
            }
          },
          through: {
            attributes: []
          }
        }
      ]
    });

    const rooms: { id: number; name: string; currentDay: number; tasks: Task[] }[] = [];

    tasks.forEach((task) => {
      const index = rooms.findIndex((room) => room.id == task.room.id);
      const { room, ...newTask } = task.toJSON();
      if (index == -1) {
        rooms.push({
          id: room.id,
          name: room.name,
          currentDay: room.currentDay,
          tasks: [newTask as Task]
        });
      } else {
        rooms[index].tasks.push(newTask as Task);
      }
    });

    return rooms;
  }//My code

  async labelUserTasks({ uid, rooms, labels, date }: LabelUserTasksDto) {
    const labelTasks = await this.taskRepository.findAll({
      where: {
        room_id: rooms,
        executor_uid: { [Op.ne]: uid },
        creator_uid: { [Op.ne]: uid },
        end_date: { [Op.gte]: date ? date : new Date() },
        start_date: { [Op.lte]: date ? date : new Date() }
      },
      include: {
        model: Label,
        required: true,
        where: {
          id: labels.map((label) => label.id)
        }
      }
    });

    return labelTasks;
  }//My code

  async ownUserTasks({ uid, rooms, date }: OwnUserTasksDto) {
    const ownTasks = await this.taskRepository.findAll({
      where: {
        room_id: rooms,
        [Op.or]: [{ executor_uid: uid }, { creator_uid: uid }],
        end_date: { [Op.gte]: date ? date : new Date() },
        start_date: { [Op.lte]: date ? date : new Date() }
      }
    });

    return ownTasks;
  }//My code

  async updateTask({ labels, ...newDto }: Partial<UpdateTaskDto>) {
    const transaction = await this.taskLogRepository.sequelize.transaction();
    try {
      const [previousTask, teams] = await Promise.all([
        this.taskRepository.findByPk(newDto.task_id, {
          attributes: { exclude: ['updatedAt', 'createdAt'] }
        }), //old task
        lastValueFrom(this.permissionClient.send('get-teams-by-user', newDto.updated_by_uid))
      ]);

      const availableTeams = teams.filter((team: any) =>
        team.options.some((option) => option.name == AllOptions.CREATE_DELETE_TASKS || option.name == AllOptions.FACILITY_ADMIN)
      ); //user teams

      const users = await this.userService.getUsersByTeams(availableTeams.map((team) => team.id)); //available executors(rewrite for redis)

      if (labels) {
        const newLabels = await this.labelRepository.findAll({
          where: { id: labels.map((label) => label.id) },
          include: [
            {
              model: Facility,
              required: true,
              attributes: [],
              include: [
                {
                  model: Room,
                  required: true,
                  attributes: [],
                  include: [
                    {
                      model: Task,
                      where: { id: newDto.task_id },
                      attributes: []
                    }
                  ]
                }
              ]
            }
          ]
        });
        //take only available labels from dto

        // labels update
        await previousTask.$set('labels', newLabels, { transaction });
        await previousTask.save({ transaction });
      }

      if (newDto?.executor_uid) newDto.executor_uid = users.find((user) => user.uid == newDto.executor_uid).uid;

      await this.taskRepository.update<Task>(newDto, {
        where: { id: newDto.task_id },
        transaction
      });

      this.permissionClient.emit('object-edited', { object: 'task', id: newDto.task_id });

      const user = await this.userService.getUserByUid(newDto.updated_by_uid);

      await this.taskLogRepository.bulkCreate(this.logTaskDiff({ dto: newDto, task: previousTask, user }), { transaction });
      await transaction.commit();

      return await this.getTask(newDto.task_id);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }//My code

  logTaskDiff({ dto, task, user }: LogTaskDiffDto) {
    const diff: {
      task_id: number;
      data: TaskLogData;
    }[] = [];

    for (const key in dto)
      if (task[key] != dto[key] && key != 'task_id' && key != 'updated_by_uid')
        diff.push({
          task_id: dto.task_id,
          data: {
            type: TaskActionTypes.Update,
            user: {
              uid: user.uid,
              avatar: user.avatar_path,
              name: user.name
            },
            field: key,
            old_value: task[key],
            new_value: dto[key]
          }
        });

    return diff;
  }

  async getTask(id: number) {
    const task = await this.taskRepository.findByPk(id, {
      include: {
        model: Label,
        attributes: ['id', 'name', 'facility_id'],
        through: { attributes: [] }
      }
    });

    return task;
  }

  async createTask(dto: CreateTaskDto) {
    const transaction = await this.taskLogRepository.sequelize.transaction();
    try {
      const { labels, ...newTask } = dto;
      const task = await this.taskRepository.create(newTask, { transaction });
      const facilityLabels = await this.labelRepository.findAll({
        where: { id: labels },
        include: [
          {
            model: Facility,
            required: true,
            include: [
              {
                model: Room,
                required: true,
                where: {
                  id: newTask.room_id
                }
              }
            ]
          }
        ]
      });

      await task.$set('labels', facilityLabels, { transaction });
      await task.save({ transaction });

      const user = await this.userService.getUserByUid(dto.creator_uid);//rewrite for redis
      const log: AddTaskLogDto = {
        task_id: task.id,
        data: {
          type: TaskActionTypes.Create,
          user: {
            uid: user.uid,
            avatar: user.avatar_path, //does it rly need???
            name: user.name
          }
        }
      };

      await this.taskLogRepository.create(log, { transaction });
      await transaction.commit();

      return task;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }//My code

  async addTaskLog(log: AddTaskLogDto) {
    await this.taskLogRepository.create(log);
  }

  async getTasksByFacility(dto: GetTasksByFacility) {
    try {
      const [rooms, facilities] = await Promise.all([
        this.roomService.getRoomsWithTasksByUser(dto) as Promise<RTasks[]>,
        lastValueFrom(this.permissionClient.send('get-facilities-by-user', dto.uid))
      ]);
      const facility = facilities.find((facility) => facility.id == dto.facility_id);

      return rooms?.filter((room) => room.facility_id == facility?.id && room.tasks.length);
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getTasksAbleToCreateDelete(uid: string): Promise<Task[]> {
    const createdTasks = this.taskRepository.findAll({
      where: {
        creator_uid: uid
      }
    });
    const adminFacilities = lastValueFrom(this.permissionClient.send('get-facilities-by-user', uid)).then(
      (facilities: PermissionFacilities[]) => {
        return facilities.clearMap((facility) =>
          facility.options.some((option) => option.name == AllOptions.FACILITY_ADMIN) ? facility.id : undefined
        );
      }
    );

    const adminTasks = await this.taskRepository.findAll({
      include: [
        {
          model: Label,
          as: 'labels',
          where: {
            facility_id: await adminFacilities
          }
        }
      ]
    });

    return (await createdTasks).concat(adminTasks);
  }//REWRITE FOR 1 QUERY!!!!!!!!!!!!!!

  async setTasksTemplateForCycle(dto: { name: string; room_id: number }) {
    const transaction = await this.taskRepository.sequelize.transaction();
    try {
      const template = await this.cycleTasksTemplatesRepository.create(dto, { transaction });
      const tasks = await this.taskRepository.findAll({
        where: {
          room_id: dto.room_id,
          start_date: { [Op.gte]: sequelize.literal(`NOW()::DATE-"room"."currentDay"`) }
        },
        include: {
          model: Room,
          as: 'room',
          attributes: []
        },
        attributes: [
          'id',
          'start_date',
          'end_date',
          [sequelize.literal(`(EXTRACT(days FROM "Task"."start_date"-NOW()::DATE)+"room"."currentDay"):: INT`), 'cycle_start_day'],
          [sequelize.literal(`(EXTRACT(days FROM "Task"."end_date"-NOW()::DATE)+"room"."currentDay"):: INT`), 'cycle_end_day']
        ]
      });

      const response = await this.taskTemplateRepository.bulkCreate(
        tasks.map((task) => ({
          template_id: template.id,
          task_id: task.id,
          start_day: task.getDataValue('cycle_start_day'),
          end_day: task.getDataValue('cycle_end_day')
        })),
        { transaction }
      );

      transaction.commit();
      return response;
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  }//My code

  async applyTasksTemplateForCycle({
    template_name,
    room_id,
    creator_uid
  }: {
    template_name: string;
    room_id: number;
    creator_uid: string;
  }) {
    const cycleTasksTemplates = await this.cycleTasksTemplatesRepository.findOne({
      where: {
        name: template_name,
        room_id: room_id
      },
      include: [
        {
          model: Task,
          as: 'tasks',
          through: {
            attributes: ['start_day', 'end_day']
          },
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt'],
            include: [
              [sequelize.literal(`'${creator_uid}'`), 'creator_uid'],
              [
                sequelize.literal('(NOW():: DATE - "room"."currentDay" + "tasks->TaskTemplate"."start_day"):: TIMESTAMP WITH TIME ZONE'),
                'start_date'
              ],
              [
                sequelize.literal('(NOW():: DATE - "room"."currentDay" + "tasks->TaskTemplate"."end_day"):: TIMESTAMP WITH TIME ZONE'),
                'end_date'
              ]
            ]
          }
        },
        {
          model: Room,
          as: 'room',
          attributes: []
        }
      ],
      attributes: []
    });

    const tasks = cycleTasksTemplates.tasks;

    return await this.taskRepository.bulkCreate(tasks.map(task=>task.toJSON()));
  }//My code

  async getTasksTemplatesByRoom(room_id: number) {
    const cycleTasksTemplates = await this.cycleTasksTemplatesRepository.findAll({
      where: { room_id },
      attributes: ['id', 'name']
    });

    return cycleTasksTemplates;
  }//My code

  async getRoomsAndLabelsByUser({uid, room_ids}: {uid: string, room_ids?: number[]}){
    type ids = { id: number }[];
    const [rooms, labels] = await Promise.all([
      lastValueFrom<ids>(this.permissionClient.send('get-rooms-by-user', uid)).then((rooms) =>
        room_ids?rooms.clearMap((room) => (room_ids.includes(room.id) ? room.id : undefined)):rooms.map(room=>room.id)
      ),
      lastValueFrom<ids>(this.permissionClient.send('get-labels-by-user', uid)).then((labels) => labels.map((label) => label.id))
    ]);

    return {rooms, labels};
  }//My code
}
