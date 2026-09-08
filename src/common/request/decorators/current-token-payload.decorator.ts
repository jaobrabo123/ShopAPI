import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TokenPayloadDTO } from "../../../modules/auth/dto/token-payload.dto.js";
import { CustomRequest } from "../interfaces/custom-request.interface.js";

export const CurrentTokenPayload = createParamDecorator((data: keyof TokenPayloadDTO, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    return data ? request.tokenPayload?.[data] : request.tokenPayload;
});
