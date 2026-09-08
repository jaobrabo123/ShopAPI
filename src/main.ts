import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module.js";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());

    const config = new DocumentBuilder()
        .setTitle("Shop API")
        .setVersion("1.0")
        .addBearerAuth({ type: "http" }, "accessToken")
        .addSecurityRequirements("accessToken")
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, documentFactory);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
