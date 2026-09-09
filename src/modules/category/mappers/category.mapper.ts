import { Injectable } from "@nestjs/common";
import { Category } from "../entities/category.entity.js";
import { PublicCategoryDto } from "../dto/public-category.dto.js";

@Injectable()
export class CategoryMapper {
    toPublicCategoryDto(category: Category): PublicCategoryDto {
        return {
            id: category.id,
            name: category.name,
        };
    }
}
