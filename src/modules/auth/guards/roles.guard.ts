import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../../user/enum/role.enum.js";
import { CustomRequest } from "../../../common/request/interfaces/custom-request.interface.js";
import { AccessDeniedException } from "../../../common/exceptions/access-denied.exception.js";
import { REQUIRE_ROLES_KEY } from "../../../common/request/decorators/require-roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(REQUIRE_ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Se a rota não tiver o decorator @Roles(), libera o acesso (qualquer logado acessa)
        if (!requiredRoles || !requiredRoles.length) {
            return true;
        }

        // Pega o request (neste ponto o AuthGuard já colocou o usuário lá dentro)
        const { tokenPayload } = context.switchToHttp().getRequest<CustomRequest>();

        // Se por algum motivo não houver usuário, bloqueia
        if (!tokenPayload) {
            throw new UnauthorizedException("User unauthenticated");
        }

        const hasRole = requiredRoles.includes(tokenPayload.role);

        if (!hasRole) {
            throw new AccessDeniedException();
        }

        return true;
    }
}
