import { Module, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config.js";
import { UserModule } from "./modules/user/user.module.js";
import { DatabaseModule } from "./infra/database/database.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { APP_PIPE } from "@nestjs/core";

@Module({
    imports: [ConfigModule.forRoot({ load: [appConfig], isGlobal: true }), UserModule, DatabaseModule, AuthModule],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({
                transform: true,
                forbidNonWhitelisted: true,
                whitelist: true,
                exceptionFactory: errors => new UnprocessableEntityException(errors),
            }),
        },
    ],
})
export class AppModule {}
