import { Reflector } from "@nestjs/core";
import { Role } from "../../user/enum/role.enum.js";
import { RolesGuard } from "./roles.guard.js";
import { buildContext } from "../test/factories/context.factory.js";
import { UnauthorizedException } from "@nestjs/common";
import { AccessDeniedException } from "../../../common/exceptions/access-denied.exception.js";

describe("RolesGuard", () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = { getAllAndOverride: vitest.fn() } as unknown as Reflector;

        guard = new RolesGuard(reflector);
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    describe("canActivate", () => {
        it("should allow if the route hasn't required roles", () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue([]);

            const allowed = guard.canActivate(buildContext());

            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
            expect(allowed).toBe(true);
        });

        it("should throw UnauthorizedException if the route is protected and the user is not authenticated", () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue([Role.ADMIN]);

            expect(() => guard.canActivate(buildContext())).toThrow(UnauthorizedException);
            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
        });

        it("should throw AccessDeniedException if the route is protected and the user hasn't the required role", () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue([Role.ADMIN]);

            expect(() => guard.canActivate(buildContext(undefined, { role: Role.USER, sub: "uuid" }))).toThrow(
                AccessDeniedException,
            );
            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
        });

        it("should allow if the user has the required role", () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue([Role.ADMIN]);

            const result = guard.canActivate(buildContext(undefined, { role: Role.ADMIN, sub: "uuid" }));

            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
        });
    });
});
