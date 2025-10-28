import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        id: number;
        email: string;
        nombreUsuario: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    perfil(req: any): any;
}
