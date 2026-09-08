import { Role } from "../enum/role.enum.js";

export class PrivateUserDto {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
