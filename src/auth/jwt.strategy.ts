import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {
        super({
            secretOrKey: 'jwt-secret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    // Verify success sẽ trả lại user 
    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this.usersRepository.findOne({ where: { username }});
        if(!user) { 
            throw new UnauthorizedException();
        }

        return user;
    }
}