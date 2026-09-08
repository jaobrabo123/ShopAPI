import { Role } from "../../user/enum/role.enum.js";

export class TokenPayloadDTO {
    sub: string;
    role: Role;
}
