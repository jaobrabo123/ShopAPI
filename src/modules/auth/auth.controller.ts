import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { PrivateUserDto } from "../user/dto/private-user.dto.js";
import { CreateUserDto } from "../user/dto/create-user.dto.js";
import { LoginDTO } from "./dto/login.dto.js";
import { LoginResponseDto } from "./dto/login-response.dto.js";
import { Public } from "../../common/request/decorators/public.decorator.js";
import { minutes, seconds, Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Throttle({
        short: {
            limit: 1,
            ttl: seconds(1),
        },
        long: {
            limit: 10,
            ttl: minutes(5),
        },
    })
    @Post("register")
    register(@Body() dto: CreateUserDto): Promise<PrivateUserDto> {
        return this.authService.register(dto);
    }

    @Public()
    @Throttle({
        short: {
            limit: 1,
            ttl: seconds(1),
        },
        long: {
            limit: 10,
            ttl: minutes(5),
        },
    })
    @Post("login")
    login(@Body() dto: LoginDTO): Promise<LoginResponseDto> {
        return this.authService.login(dto);
    }
}
