import { IsEmail, IsString } from "class-validator";
import { ToLowerCase } from "../../../common/decorators/transformers/to-lower-case.transformer.js";

export class LoginDTO {
    @ToLowerCase()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
