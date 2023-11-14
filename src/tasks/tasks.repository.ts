import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";
import { EntityRepository } from "nestjs-typeorm-custom-repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";


// Now, place to handle logic main 
@Injectable()
export class TasksRepository {
   constructor(
    @InjectRepository(Task)
    private readonly taskEntityRepository: Repository<Task>
   ) {}

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
     
        const task = this.taskEntityRepository.create({
            title,
            description,
            status: TaskStatus.OPEN
        });

        await this.taskEntityRepository.save(task);
        return task;
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        // const allTasks = await this.taskEntityRepository.find();
        // return allTasks;
        const { status, search } = filterDto;
        const query = this.taskEntityRepository.createQueryBuilder('task');

        if(status) {
            query.andWhere('task.status = :status', { status })
        }

        if(search) {
            query.andWhere(
                'task.title LIKE :search OR task.description LIKE :search', {
                    search: `%${search}%`
                }
            )
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.taskEntityRepository.findOneBy({ id });
        if(!found) {
            throw new NotFoundException(`Task with id: ${id} not found`);
        }
        return found;
    }

    async deleteTask(id: string): Promise<void> {
        const found = await this.getTaskById(id);
        await this.taskEntityRepository.delete(found.id);
    }

    async updateTask(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.taskEntityRepository.save(task);
        return task;
    }

}