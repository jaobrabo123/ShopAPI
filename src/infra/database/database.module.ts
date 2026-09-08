import { Module } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { DB_PROVIDER } from "./constants/db-provider.constant.js";
import appConfig from "../../config/app.config.js";

@Module({
    providers: [
        {
            provide: DB_PROVIDER,
            inject: [appConfig.KEY],
            useFactory: (config: ConfigType<typeof appConfig>) => {
                return drizzle(config.database.url);
            },
        },
    ],
    exports: [DB_PROVIDER],
})
export class DatabaseModule {}
