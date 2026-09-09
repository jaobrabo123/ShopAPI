import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDb } from "../../infra/database/constants/db-provider.constant.js";
import type { DB } from "../../infra/database/types/db.type.js";
import { userTable } from "../../infra/database/schema.js";
import { User } from "./entities/user.entity.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { TokenPayloadDTO } from "../auth/dto/token-payload.dto.js";
import { PrivateUserDto } from "./dto/private-user.dto.js";
import { UserMapper } from "./mappers/user.mapper.js";
import { eq } from "drizzle-orm";

@Injectable()
export class UserService {
    constructor(
        @InjectDb() private readonly db: DB,
        private readonly userMapper: UserMapper,
    ) {}

    private asserExists<T>(user: T): asserts user is NonNullable<T> {
        if (!user) throw new NotFoundException("User not found");
    }

    async isEmailAvailable(email: string): Promise<boolean> {
        const result = await this.db.query.userTable.findFirst({
            where: { email },
            columns: { id: true },
        });
        return !result;
    }

    async findInternalByEmail(email: string): Promise<User | null> {
        const result = await this.db.query.userTable.findFirst({
            where: { email },
        });
        return result ?? null;
    }

    async findInternalById(id: string): Promise<User | null> {
        const result = await this.db.query.userTable.findFirst({
            where: { id },
        });
        return result ?? null;
    }

    async create(dto: typeof userTable.$inferInsert): Promise<User> {
        const [user] = await this.db.insert(userTable).values(dto).returning();
        return user;
    }

    async findMe(tokenPayload: TokenPayloadDTO): Promise<PrivateUserDto> {
        const user = await this.findInternalById(tokenPayload.sub);
        this.asserExists(user);

        return this.userMapper.toPrivateUserDto(user);
    }

    async updateMe(tokenPayload: TokenPayloadDTO, dto: UpdateUserDto): Promise<PrivateUserDto> {
        const user = await this.findInternalById(tokenPayload.sub);
        this.asserExists(user);

        const [updated] = await this.db.update(userTable).set(dto).where(eq(userTable.id, user.id)).returning();
        return this.userMapper.toPrivateUserDto(updated);
    }
}
