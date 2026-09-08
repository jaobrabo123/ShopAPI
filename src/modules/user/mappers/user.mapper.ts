import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity.js";
import { PrivateUserDto } from "../dto/private-user.dto.js";

@Injectable()
export class UserMapper {
    toPrivateUserDto(user: User): PrivateUserDto {
        return {
            createdAt: user.createdAt,
            email: user.email,
            id: user.id,
            name: user.name,
            role: user.role,
            updatedAt: user.updatedAt,
        };
    }
}
