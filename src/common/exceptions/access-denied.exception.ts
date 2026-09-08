import { ForbiddenException, HttpStatus } from "@nestjs/common";
import { STATUS_CODES } from "node:http";

export class AccessDeniedException extends ForbiddenException {
    constructor(message?: string) {
        super({
            error: STATUS_CODES[HttpStatus.FORBIDDEN],
            message: message ?? "Acess denied",
            statusCode: HttpStatus.FORBIDDEN,
            code: "ACCESS_DENIED",
        });
    }
}
