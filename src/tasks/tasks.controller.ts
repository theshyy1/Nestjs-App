import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';


// Controller là nơi điều khiển, xử lí các http request, tiếp nhận yêu cầu gọi các service 
// để xử lí logic và trả về người dùng
@Controller('tasks') //root route
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status') //status them vao de biet la update status thoi !!
    updateTask(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto): Promise<Task> {
        const { status } = updateStatusDto;
        return this.tasksService.updateTask(id, status);
    }
}
