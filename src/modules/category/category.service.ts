import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto.js";
import { UpdateCategoryDto } from "./dto/update-category.dto.js";
import { CategoryMapper } from "./mappers/category.mapper.js";
import type { DB } from "../../infra/database/types/db.type.js";
import { InjectDb } from "../../infra/database/constants/db-provider.constant.js";
import { categoryTable } from "../../infra/database/schema.js";
import { PublicCategoryDto } from "./dto/public-category.dto.js";

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryMapper: CategoryMapper,
        @InjectDb() private readonly db: DB,
    ) {}

    async isNameAvailable(name: string): Promise<boolean> {
        const exists = await this.db.query.categoryTable.findFirst({ columns: { id: true }, where: { name } });
        return !exists;
    }

    async assertNameIsAvailable(name: string): Promise<void> {
        const nameAvailable = await this.isNameAvailable(name);
        if (!nameAvailable) {
            throw new ConflictException("A category with this name already exists");
        }
    }

    async create(dto: CreateCategoryDto): Promise<PublicCategoryDto> {
        await this.assertNameIsAvailable(dto.name);

        const [category] = await this.db.insert(categoryTable).values(dto).returning();

        return this.categoryMapper.toPublicCategoryDto(category);
    }

    async findAll(): Promise<PublicCategoryDto[]> {
        const categories = await this.db.query.categoryTable.findMany({ orderBy: { createdAt: "desc" } });
        return categories.map(cat => this.categoryMapper.toPublicCategoryDto(cat));
    }

    findOne(id: number) {
        return `This action returns a #${id} category`;
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return `This action updates a #${id} category`;
    }

    remove(id: number) {
        return `This action removes a #${id} category`;
    }
}
