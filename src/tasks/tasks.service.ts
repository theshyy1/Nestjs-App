import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

// Service là chịu trách nhiệm thực hiện các login, nghiệp vụ
@Injectable()
export class TasksService {
    constructor(
        private tasksRepository: TasksRepository
    ) {}

    getTaskById(id: string, user: User): Promise<Task> {
        return this.tasksRepository.getTaskById(id, user);
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user);
    }

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user);
    }

    deleteTask(id: string, user: User): Promise<void> {
        return this.tasksRepository.deleteTask(id, user);
    }
    
    updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
        return this.tasksRepository.updateTask(id, status, user);
    }
}
