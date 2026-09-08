import { User } from "../../entities/user.entity.js";
import { Role } from "../../enum/role.enum.js";

export default (overrides: Partial<User> = {}): User => {
    return {
        createdAt: new Date(),
        email: "joao@email.com",
        id: crypto.randomUUID(),
        name: "Joao",
        passwordHash: "as8d8t7asdt78",
        role: Role.USER,
        updatedAt: new Date(),
        ...overrides,
    };
};
