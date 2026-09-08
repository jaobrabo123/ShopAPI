import { Role } from "../enum/role.enum.js";

export class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
