import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";


// Now, place to handle logic main 
@Injectable()
export class TasksRepository {
    constructor(
        @InjectRepository(Task)
        private readonly taskEntityRepository: Repository<Task>
    ) {}
    private logger = new Logger('TaskRepository');

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
     
        const task = this.taskEntityRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });

        await this.taskEntityRepository.save(task);
        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.taskEntityRepository.createQueryBuilder('task');
        query.where({ user });


        if(status) {
            query.andWhere('task.status = :status', { status })
        }
 
        if(search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {
                    search: `%${search}%` 
                }
            )
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks with ${user.username}`, error.stack)
            throw new InternalServerErrorException();
        }
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskEntityRepository.findOneBy({ id, user });
        if(!found) {
            throw new NotFoundException(`Task with id: ${id} not found`);
        }
        return found;
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const found = await this.getTaskById(id, user);
        await this.taskEntityRepository.delete(found.id);
    }

    async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.taskEntityRepository.save(task);
        return task;
    }

}