import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

// Controller là nơi điều khiển, xử lí các http request, tiếp nhận yêu cầu gọi các service 
// để xử lí logic và trả về người dùng
@Controller('tasks') //root route
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TaskController');
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto,  @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(` User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a task with content ${JSON.stringify(createTaskDto)}`)
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string,@GetUser() user: User ): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status') //status them vao de biet la update status thoi !!
    updateTask(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto, @GetUser() user: User): Promise<Task> {
        const { status } = updateStatusDto;
        return this.tasksService.updateTask(id, status, user);
    }
}
