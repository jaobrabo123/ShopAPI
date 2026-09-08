import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module.js";
import { AuthService } from "./auth.service.js";
import { HashingService } from "./hashing/hashing.service.js";
import { BcryptService } from "./hashing/bcrypt.service.js";
import { AuthController } from "./auth.controller.js";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigType } from "@nestjs/config";
import authConfig from "./config/auth.config.js";

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            imports: [ConfigModule.forFeature(authConfig)],
            inject: [authConfig.KEY],
            useFactory: (config: ConfigType<typeof authConfig>) => {
                return { secret: config.jwt.secret, signOptions: { expiresIn: "1H" } };
            },
        }),
    ],
    providers: [AuthService, { provide: HashingService, useClass: BcryptService }],
    controllers: [AuthController],
})
export class AuthModule {}
