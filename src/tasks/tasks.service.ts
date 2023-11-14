import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { Repository } from 'typeorm';

// Service là chịu trách nhiệm thực hiện các login, nghiệp vụ
@Injectable()
export class TasksService {
    constructor(
        private tasksRepository: TasksRepository
    ) {}

    getTaskById(id: string): Promise<Task> {
        return this.tasksRepository.getTaskById(id);
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto);
    }

    deleteTask(id: string): Promise<void> {
        return this.tasksRepository.deleteTask(id);
    }
    
    updateTask(id: string, status: TaskStatus): Promise<Task> {
        return this.tasksRepository.updateTask(id, status);
    }

    // getTasksWithFilter(filterDto: GetTasksFilterDto) {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();

    //     if(status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if(search) {
    //         tasks = tasks.filter(task => {
    //             if(task.title.includes(search) || task.description.includes(search)) {
    //                 return true;
    //             }       
    //             return false;
    //         })
    //     }
    //     return tasks;
    // }

   

}
