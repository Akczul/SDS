import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private users;
    private jwt;
    constructor(users: UsersService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        id: number;
        email: string;
        nombreUsuario: string;
    }>;
    login(identifier: string, password: string): Promise<{
        access_token: string;
    }>;
}
