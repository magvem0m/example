import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { v4 } from 'uuid';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            updateTask: jest.fn((dto: UpdateTaskDto) => {
              //
            }),
            getTask: jest.fn((id) => {
              return new Promise((resolve) => {
                resolve({
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
              });
            }),
            deleteTask: jest.fn((id) => {
              //
            })
          }
        }
      ]
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should update a room task', async () => {
    jest.spyOn(service, 'updateTask');
    const userId = v4();
    const dto: UpdateTaskDto = {
      endDate: '2022-09-03',
      assignedToUserUId: userId,
      taskId: 1,
      updatedByUid: userId,
      color: 0,
      description: 'test',
      startDate: '2022-09-03',
      highPriority: true,
      name: 'test',
      phase: 0,
      report: '',
      reschedule: false,
      reviewNeeded: false,
      shortDescription: 'test',
      status: 0,
      branchId: null,
      roomId: 1
    };
    expect(await controller.updateTask(dto)).not.toBeDefined();
    expect(service.updateTask).toBeCalledWith(dto);
  });
  it('should return a task', async () => {
    jest.spyOn(service, 'getTask');
    const id = 1;
    expect(await controller.getTask(id)).toEqual({
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
    expect(service.getTask).toBeCalledWith(id);
  });

  it('should delete a task', async () => {
    jest.spyOn(service, 'deleteTask');
    const dto = { taskId: 1, deletedByUid: v4() };
    expect(await controller.deleteTask(dto)).not.toBeDefined();
    expect(service.deleteTask).toBeCalledWith(dto);
  });
});
