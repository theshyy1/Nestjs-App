import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(private usersRepository: UsersRepository) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.usersRepository.createUser(authCredentialsDto);
    }

    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.usersRepository.signIn(authCredentialsDto);
    }

}
