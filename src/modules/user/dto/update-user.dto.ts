import { IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name?: string;

    @IsOptional()
    @IsStrongPassword()
    password?: string;
}
