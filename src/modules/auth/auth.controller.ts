import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { PrivateUserDto } from "../user/dto/private-user.dto.js";
import { CreateUserDto } from "../user/dto/create-user.dto.js";
import { LoginDTO } from "./dto/login.dto.js";
import { LoginResponseDto } from "./dto/login-response.dto.js";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    register(@Body() dto: CreateUserDto): Promise<PrivateUserDto> {
        return this.authService.register(dto);
    }

    @Post("login")
    login(@Body() dto: LoginDTO): Promise<LoginResponseDto> {
        return this.authService.login(dto);
    }
}
