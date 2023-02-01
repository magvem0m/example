import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskLog } from 'src/models/task-log.model';
import { Task } from 'src/models/task.model';
import { v4 } from 'uuid';
import { UserService } from '../user/user.service';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Employee } from 'src/models/employee.model';

describe('TaskService', () => {
  let service: TaskService;
  let modelTaskLog: typeof TaskLog;
  let modelTask: typeof Task;
  let serviceUser: UserService;

  const mockTaskLogRepository = {
    destroy: jest.fn(),
    create: jest.fn((dto) => {
      return new Promise((resolve) => {
        resolve(1);
      });
    })
  };

  const mockTaskRepository = {
    destroy: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  };

  const mockUserService = {
    getUserById: jest.fn((userUid) => {
      return new Promise((resolve) => {
        resolve({
          uid: userUid,
          name: 'User',
          phone: '89149030670',
          email: 'iogru@gmail.com',
          avatar_path: 'uploads/avatars/1657697333758download.png',
          details: {
            id: 8,
            pin: null,
            telegramId: 765136728,
            userId: userUid,
            createdAt: '2022-08-29T12:25:01.247Z',
            updatedAt: '2022-08-29T12:25:01.721Z'
          },
          userOrganizations: [
            {
              id: 1,
              name: 'TestOrganization',
              ownerUId: userUid,
              createdAt: '2022-07-12T20:36:57.162Z',
              updatedAt: '2022-07-12T20:36:57.162Z'
            },
            {
              id: 2,
              name: 'iogru',
              ownerUId: userUid,
              createdAt: '2022-08-01T11:44:55.453Z',
              updatedAt: '2022-08-01T11:44:55.453Z'
            }
          ],
          employeeOf: [
            {
              id: 1,
              name: 'TestOrganization',
              ownerUId: userUid,
              createdAt: '2022-07-12T20:36:57.162Z',
              updatedAt: '2022-07-12T20:36:57.162Z',
              Employee: {
                id: 1,
                userId: userUid,
                organizationId: 1,
                roleId: null,
                createdAt: '2022-07-12T20:37:18.430Z',
                updatedAt: '2022-07-12T20:37:18.430Z'
              }
            }
          ]
        });
      });
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(TaskLog),
          useValue: mockTaskLogRepository
        },
        {
          provide: getModelToken(Task),
          useValue: mockTaskRepository
        },
        {
          provide: UserService,
          useValue: mockUserService
        }
      ]
    }).compile();

    service = module.get<TaskService>(TaskService);
    modelTaskLog = module.get<typeof TaskLog>(getModelToken(TaskLog));
    modelTask = module.get<typeof Task>(getModelToken(Task));
    serviceUser = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(modelTaskLog).toBeDefined();
    expect(modelTask).toBeDefined();
    expect(serviceUser).toBeDefined();
  });

  it('should destroy a task', async () => {
    jest.spyOn(modelTaskLog, 'destroy');
    jest.spyOn(modelTask, 'destroy');
    const id = 1;
    expect(await service.deleteTask({ taskId: id, deletedByUid: v4() })).not.toBeDefined();
    expect(modelTaskLog.destroy).toBeCalledWith({ where: { taskId: id } });
    expect(modelTask.destroy).toBeCalledWith({ where: { id } });
  });

  it('should update a task', async () => {
    const id = v4();
    const dto: UpdateTaskDto = {
      taskId: 1,
      updatedByUid: id,
      color: 1,
      description: 'test',
      endDate: '2022-09-03',
      assignedToUserUId: id,
      startDate: '2022-09-03',
      highPriority: true,
      name: 'test',
      phase: 1,
      report: '',
      reschedule: false,
      reviewNeeded: false,
      shortDescription: 'test',
      status: 2,
      branchId: 1,
      roomId: 1
    };
    jest.spyOn(modelTask, 'findByPk').mockReturnValueOnce({
      id: dto.taskId,
      roomId: 1,
      branchId: null,
      name: 'task 1',
      phase: 0,
      status: 0,
      startDate: '2022-08-29',
      endDate: '2022-08-29',
      description: 'desc',
      shortDescription: 'shortDesc',
      report: null,
      color: 0,
      reviewNeeded: true,
      reschedule: true,
      highPriority: true
    } as any);

    jest.spyOn(modelTask, 'update').mockReturnValueOnce({
      id: dto.taskId,
      roomId: dto.roomId,
      branchId: dto.branchId,
      name: dto.name,
      phase: dto.phase,
      status: dto.phase,
      startDate: dto.startDate,
      endDate: dto.endDate,
      description: dto.description,
      shortDescription: dto.shortDescription,
      report: dto.report,
      color: dto.color,
      reviewNeeded: dto.reviewNeeded,
      reschedule: dto.reschedule,
      highPriority: dto.highPriority,
      createdAt: '2022-08-29T07:50:59.840Z',
      updatedAt: '2022-08-29T07:50:59.840Z'
    } as any);

    expect(await service.updateTask(dto)).not.toBeDefined();
    expect(modelTask.findByPk).toBeCalledWith(dto.taskId, {
      attributes: { exclude: ['updatedAt', 'createdAt'] }
    });
    expect(modelTask.update).toBeCalledWith(
      {
        branchId: dto.branchId,
        name: dto.name,
        phase: dto.phase,
        status: dto.status,
        startDate: dto.startDate,
        endDate: dto.endDate,
        description: dto.description,
        shortDescription: dto.shortDescription,
        report: dto.report,
        color: dto.color,
        reviewNeeded: dto.reviewNeeded,
        roomId: dto.roomId,
        reschedule: dto.reschedule,
        highPriority: dto.highPriority,
        assignedToUserUId: dto.assignedToUserUId
      },
      {
        where: { id: dto.taskId }
      }
    );
    expect(serviceUser.getUserById).toBeCalledWith(dto.updatedByUid);
  });

  it('should return a task', async () => {
    const id = 1;
    jest.spyOn(modelTask, 'findByPk').mockReturnValueOnce({
      id: id,
      roomId: 1,
      branchId: null,
      name: 'task 1',
      phase: 0,
      status: 0,
      startDate: '2022-08-29',
      endDate: '2022-08-29',
      description: 'desc',
      shortDescription: 'shortDesc',
      report: null,
      color: 0,
      reviewNeeded: true,
      reschedule: true,
      highPriority: true,
      createdAt: '2022-08-29T07:50:59.840Z',
      updatedAt: '2022-08-29T07:50:59.840Z',
      taskLogs: [
        {
          id: 1,
          taskId: id,
          data: {
            message: 'created task',
            userName: 'User',
            userAvatar: 'uploads/avatars/1657697333758download.png'
          },
          createdAt: '2022-08-29T07:51:00.334Z'
        }
      ]
    } as any);
    expect(await service.getTask(id)).toEqual({
      id: id,
      roomId: 1,
      branchId: null,
      name: 'task 1',
      phase: 0,
      status: 0,
      startDate: '2022-08-29',
      endDate: '2022-08-29',
      description: 'desc',
      shortDescription: 'shortDesc',
      report: null,
      color: 0,
      reviewNeeded: true,
      reschedule: true,
      highPriority: true,
      createdAt: '2022-08-29T07:50:59.840Z',
      updatedAt: '2022-08-29T07:50:59.840Z',
      taskLogs: [
        {
          id: 1,
          taskId: id,
          data: {
            message: 'created task',
            userName: 'User',
            userAvatar: 'uploads/avatars/1657697333758download.png'
          },
          createdAt: '2022-08-29T07:51:00.334Z'
        }
      ]
    });
    expect(modelTask.findByPk).toBeCalledWith(id, {
      include: [
        {
          model: TaskLog,
          as: 'taskLogs',
          attributes: { exclude: ['updatedAt'] }
        },
        {
          model: Employee,
          as: 'creator'
        },
        {
          model: Employee,
          as: 'executor'
        }
      ]
    });
  });
});
