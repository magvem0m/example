import { Controller, HttpException, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskService } from './task.service';
import { ExceptionFilterMs } from 'src/filters/controller-exception.filter';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUserTasksByRoomsForMonthDto } from './dto/get-user-tasks-by-rooms.dto';
import { GetTasksByUser } from './dto/get-tasks-by-user.dto';
import { GetTasksByFacility } from './dto/get-tasks-by-facility.dto';

@UseFilters(new ExceptionFilterMs())
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @MessagePattern('is-task-exist')
  async isTaskExist(taskId: number): Promise<boolean> {
    return await this.taskService.isTaskExist(taskId);
  }

  @MessagePattern('update-task')
  async updateTask(task: Partial<UpdateTaskDto>) {
    return await this.taskService.updateTask(task);
  }

  @MessagePattern('get-task')
  async getTask(id: number) {
    return await this.taskService.getTask(id);
  }

  @MessagePattern('get-tasks-by-user')
  async getTasksByUser(dto: GetTasksByUser) {
    return await this.taskService.getTasksByUser(dto);
  }

  @MessagePattern('delete-room-task')
  async deleteTask(task_id: number) {
    return await this.taskService.deleteTask(task_id);
  }

  @MessagePattern('create-task')
  async createTask(dto: CreateTaskDto) {
    return await this.taskService.createTask(dto);
  }

  @MessagePattern('get-tasks-by-facility')
  async getTasksByFacility(dto: GetTasksByFacility) {
    const response = await this.taskService.getTasksByFacility({ ...dto, out: true });
    return response;
  }

  @MessagePattern('get-tasks-by-facility-for-cycle')
  async getTasksByFacilityForCycle(dto: GetTasksByFacility) {
    return await this.taskService.getTasksByFacility({
      ...dto,
      start_date: dto?.start_date ? dto.start_date : new Date('2000-11-24T13:45:13.432Z'),
      end_date: dto?.end_date ? dto.end_date : new Date('2030-11-24T13:45:13.432Z'),
      out: false
    });
  }

  @MessagePattern('get-tasks-by-rooms-and-uid-for-month')
  async getTasksByRoomsAndUserForMonth(dto: GetUserTasksByRoomsForMonthDto) {
    return await this.taskService.getTasksByRoomsAndUserForMonth(dto);
  }

  @MessagePattern('get-tasks-able-to-create-delete')
  async getTasksAbleToCreateDelete(uid: string) {
    console.log(uid);
    return await this.taskService.getTasksAbleToCreateDelete(uid);
  }

  @MessagePattern('set-tasks-template-for-cycle')
  async setTasksTemplateForCycle(dto: { name: string; room_id: number }) {
    return await this.taskService.setTasksTemplateForCycle(dto);
  }

  @MessagePattern('apply-tasks-template-for-cycle')
  async applyTasksTemplateForCycle(dto: { room_id: number; template_name: string; creator_uid: string }) {
    return await this.taskService.applyTasksTemplateForCycle(dto);
  }

  @MessagePattern('get-tasks-templates-by-room')
  async getTasksTemplatesByRoom(room_id: number) {
    return await this.taskService.getTasksTemplatesByRoom(room_id);
  }

  @MessagePattern('get-tasks-by-rooms')
  async getTasksByRoom(dto: { room_ids: number[]; uid: string; start_date?: Date; end_date?: Date }) {
    return await this.taskService.getTasksByRoomsAndUser(dto);
  }

  @MessagePattern('get-tasks-for-calendar')
  async getTasksByCurrentCycleAndRooms(dto: { uid: string; room_ids: number[]; date?: Date }) {
    return this.taskService.getTasksForCalendar(dto);
  }
}
