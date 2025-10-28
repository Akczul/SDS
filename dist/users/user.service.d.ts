import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    findByEmailOrUsername(identifier: string): Promise<User>;
    findById(id: number): Promise<User>;
    create(user: Partial<User>): Promise<User>;
    update(id: number, dto: UpdateUserDto): Promise<User>;
}
