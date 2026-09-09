import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CategoryService } from "./category.service.js";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";
import { RequireRoles } from "../../common/request/decorators/require-roles.decorator.js";
import { Role } from "../user/enum/role.enum.js";
import { PublicCategoryDto } from "./dto/public-category.dto.js";

@Controller("categories")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @RequireRoles(Role.ADMIN)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<PublicCategoryDto> {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    findAll(): Promise<PublicCategoryDto[]> {
        return this.categoryService.findAll();
    }

    @RequireRoles(Role.ADMIN)
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.categoryService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(+id, updateCategoryDto);
    }

    @RequireRoles(Role.ADMIN)
    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.categoryService.remove(+id);
    }
}
