import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service.js";
import { CategoryController } from "./category.controller.js";
import { CategoryMapper } from "./mappers/category.mapper.js";
import { DatabaseModule } from "../../infra/database/database.module.js";

@Module({
    imports: [DatabaseModule],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryMapper],
})
export class CategoryModule {}
