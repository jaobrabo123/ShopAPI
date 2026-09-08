import { Module, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import appConfig from "./config/app.config.js";
import { UserModule } from "./modules/user/user.module.js";
import { DatabaseModule } from "./infra/database/database.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "./modules/auth/guards/roles.guard.js";
import { minutes, seconds, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
    imports: [
        ConfigModule.forRoot({ load: [appConfig], isGlobal: true }),
        UserModule,
        DatabaseModule,
        AuthModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: "short",
                    ttl: seconds(1),
                    limit: 2,
                },
                {
                    name: "long",
                    ttl: minutes(1),
                    limit: 50,
                },
            ],
            errorMessage: "Too Many Requests",
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
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
