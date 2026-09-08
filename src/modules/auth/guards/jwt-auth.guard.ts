import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { CustomRequest } from "../../../common/request/interfaces/custom-request.interface.js";
import { TokenPayloadDTO } from "../dto/token-payload.dto.js";
import { TokenRequiredException } from "../../../common/exceptions/token-required.exception.js";
import { TokenExpiredException } from "../../../common/exceptions/token-expired.exception.js";
import { TokenInvalidException } from "../../../common/exceptions/token-invalid.exception.js";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../../common/request/decorators/public.decorator.js";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<CustomRequest>();

        const accessToken = this.extractTokenFromHeader(request);
        if (!accessToken) {
            throw new TokenRequiredException();
        }

        try {
            const payload = await this.jwtService.verifyAsync<TokenPayloadDTO>(accessToken);

            request.tokenPayload = payload;
        } catch (err) {
            if (err instanceof TokenExpiredError) throw new TokenExpiredException();

            throw new TokenInvalidException();
        }

        return true;
    }

    private extractTokenFromHeader(request: CustomRequest) {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
