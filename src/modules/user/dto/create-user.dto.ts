import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from "class-validator";
import { ToLowerCase } from "../../../common/decorators/transformers/to-lower-case.transformer.js";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @ToLowerCase()
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}
