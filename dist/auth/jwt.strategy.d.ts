import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/user.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private users;
    constructor(users: UsersService);
    validate(payload: any): Promise<{
        id: number;
        email: string;
        role: import("../users/user.entity").UserRole;
        nombre: string;
    }>;
}
export {};
