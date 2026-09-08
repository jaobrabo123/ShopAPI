import { HttpStatus, UnauthorizedException } from "@nestjs/common";
import { STATUS_CODES } from "http";

export class TokenInvalidException extends UnauthorizedException {
    constructor(message?: string) {
        super({
            error: STATUS_CODES[HttpStatus.UNAUTHORIZED],
            message: message ?? "Token invalid",
            statusCode: HttpStatus.UNAUTHORIZED,
            code: "TOKEN_INVALID",
        });
    }
}
