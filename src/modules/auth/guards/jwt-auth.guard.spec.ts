import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { Reflector } from "@nestjs/core";
import { TokenRequiredException } from "../../../common/exceptions/token-required.exception.js";
import { TokenExpiredException } from "../../../common/exceptions/token-expired.exception.js";
import { TokenInvalidException } from "../../../common/exceptions/token-invalid.exception.js";
import { TokenPayloadDTO } from "../dto/token-payload.dto.js";
import { Role } from "../../user/enum/role.enum.js";
import { buildContext } from "../test/factories/context.factory.js";

describe("JwtAuthGuard", () => {
    let guard: JwtAuthGuard;
    let jwtService: JwtService;
    let reflector: Reflector;

    beforeEach(() => {
        jwtService = { verifyAsync: vitest.fn() } as unknown as JwtService;
        reflector = { getAllAndOverride: vitest.fn() } as unknown as Reflector;

        guard = new JwtAuthGuard(jwtService, reflector);
    });

    it("should be defined", () => {
        expect(guard).toBeDefined();
    });

    describe("canActivate", () => {
        it("should allow if the route is public", async () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue(true);

            const allowed = await guard.canActivate(buildContext());

            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
            expect(allowed).toBe(true);
        });

        it("should throw TokenRequiredException if the token was not provided and the route is private", async () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);

            await expect(guard.canActivate(buildContext())).rejects.toThrow(TokenRequiredException);
            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
        });

        it("should throw TokenExpiredException if the token was expired and the route is private", async () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
            vitest.spyOn(jwtService, "verifyAsync").mockRejectedValue(new TokenExpiredError("Failed", new Date()));

            await expect(guard.canActivate(buildContext("Bearer invalid_token"))).rejects.toThrow(
                TokenExpiredException,
            );
            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
        });

        it("should throw TokenInvalidException if the token was expired and the route is private", async () => {
            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
            vitest.spyOn(jwtService, "verifyAsync").mockRejectedValue(new Error("Some Error"));

            await expect(guard.canActivate(buildContext("Bearer invalid_token"))).rejects.toThrow(
                TokenInvalidException,
            );
            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
        });

        it("should allow if the route is private and the token is valid", async () => {
            const paylaod: TokenPayloadDTO = { role: Role.USER, sub: "uuid" };
            const context = buildContext("Bearer valid_token");

            vitest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
            vitest.spyOn(jwtService, "verifyAsync").mockResolvedValue(paylaod);

            const allowed = await guard.canActivate(context);

            expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
            expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);
            expect(allowed).toBe(true);
            expect(context.switchToHttp().getRequest().tokenPayload).toEqual(paylaod);
        });
    });
});
