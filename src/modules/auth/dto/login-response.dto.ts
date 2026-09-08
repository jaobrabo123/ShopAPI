import { PrivateUserDto } from "../../user/dto/private-user.dto.js";

export class LoginResponseDto {
    user: PrivateUserDto;
    accessToken: string;
}
