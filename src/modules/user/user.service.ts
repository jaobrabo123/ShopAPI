import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { InjectDb } from "../../infra/database/constants/db-provider.constant.js";
import type { DB } from "../../infra/database/types/db.type.js";
import { userTable } from "../../infra/database/schema.js";
import { User } from "./entities/user.entity.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";

@Injectable()
export class UserService {
    constructor(@InjectDb() private readonly db: DB) {}

    async isEmailAvailable(email: string): Promise<boolean> {
        const result = await this.db
            .select({ id: userTable.id })
            .from(userTable)
            .where(eq(userTable.email, email))
            .limit(1);
        return !result[0];
    }

    async findInternalByEmail(email: string): Promise<User | null> {
        const result = await this.db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
        return result[0] ?? null;
    }

    async create(dto: typeof userTable.$inferInsert): Promise<User> {
        const [user] = await this.db.insert(userTable).values(dto).returning();
        return user;
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, _updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
