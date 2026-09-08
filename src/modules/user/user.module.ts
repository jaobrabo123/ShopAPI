import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../infra/database/database.module.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";
import { UserMapper } from "./mappers/user.mapper.js";

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService, UserMapper],
    exports: [UserService, UserMapper],
})
export class UserModule {}
