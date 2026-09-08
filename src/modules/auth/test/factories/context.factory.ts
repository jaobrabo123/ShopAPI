import { ExecutionContext } from "@nestjs/common";
import { TokenPayloadDTO } from "../../dto/token-payload.dto.js";

export function buildContext(authHeader?: string, tokenPayload?: TokenPayloadDTO): ExecutionContext {
    const request = {
        headers: { authorization: authHeader },
        tokenPayload,
    };

    return {
        switchToHttp: () => ({
            getRequest: () => request,
        }),
        getHandler: () => ({}),
        getClass: () => ({}),
    } as unknown as ExecutionContext;
}
