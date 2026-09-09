import { Controller, Get, Body, Patch } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { CurrentTokenPayload } from "../../common/request/decorators/current-token-payload.decorator.js";
import { TokenPayloadDTO } from "../auth/dto/token-payload.dto.js";
import { PrivateUserDto } from "./dto/private-user.dto.js";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("me")
    findMe(@CurrentTokenPayload() tokenPayload: TokenPayloadDTO): Promise<PrivateUserDto> {
        return this.userService.findMe(tokenPayload);
    }

    @Patch("me")
    updateMe(
        @CurrentTokenPayload() tokenPayload: TokenPayloadDTO,
        @Body() dto: UpdateUserDto,
    ): Promise<PrivateUserDto> {
        return this.userService.updateMe(tokenPayload, dto);
    }
}
