import { UsersService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    findOne(id: number): Promise<import("./user.entity").User>;
    update(id: number, dto: UpdateUserDto): Promise<import("./user.entity").User>;
}
