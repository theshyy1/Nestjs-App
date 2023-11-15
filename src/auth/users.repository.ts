import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private userEntityRepository: Repository<User>,
        private jwtService: JwtService
    ) {}
    
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword
        };
        
        const user = this.userEntityRepository.create(newUser);
        try {
            await this.userEntityRepository.save(user);
        } catch (error) {
            if(error.code === '23505') { //duplicate username error
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;

        const user = await this.userEntityRepository.findOne({ where: { username} });
        
        if(user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken = await this.jwtService.signAsync(payload);
            return { accessToken }
        } else {
            throw new UnauthorizedException('Please check your credentials again');
        }

    }
    
}   