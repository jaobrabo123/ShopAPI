import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service.js";
import { UserService } from "../user/user.service.js";
import { UserMapper } from "../user/mappers/user.mapper.js";
import { HashingService } from "./hashing/hashing.service.js";
import { CreateUserDto } from "../user/dto/create-user.dto.js";
import userFactory from "../user/test/factories/user.factory.js";
import { Role } from "../user/enum/role.enum.js";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDTO } from "./dto/login.dto.js";
import { User } from "../user/entities/user.entity.js";

describe("AuthService", () => {
    let authService: AuthService;
    let userService: UserService;
    let hashingService: HashingService;
    let userMapper: UserMapper;
    let jwtService: JwtService;

    const HASH_RESULT = "HASH_RESULT";
    const JWT_SIGN_RESULT = "JWT_SIGN_RESULT";

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: { isEmailAvailable: vitest.fn(), create: vitest.fn(), findInternalByEmail: vitest.fn() },
                },
                { provide: UserMapper, useValue: { toPrivateUserDto: vitest.fn() } },
                { provide: HashingService, useValue: { hash: vitest.fn(), compare: vitest.fn() } },
                { provide: JwtService, useValue: { signAsync: vitest.fn() } },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        hashingService = module.get<HashingService>(HashingService);
        userMapper = module.get<UserMapper>(UserMapper);
        jwtService = module.get<JwtService>(JwtService);
    });

    it("should be defined", () => {
        expect(authService).toBeDefined();
    });

    describe("register", () => {
        const dto: CreateUserDto = { email: "joao@email.com", name: "joao", password: "!@123Abc" };

        it("should create a user", async () => {
            const createdUser = userFactory({ email: dto.email, name: dto.name, passwordHash: HASH_RESULT });
            const { passwordHash: _, ...privateDto } = createdUser;

            vitest.spyOn(hashingService, "hash").mockResolvedValue(HASH_RESULT);
            vitest.spyOn(userService, "isEmailAvailable").mockResolvedValue(true);
            vitest.spyOn(userService, "create").mockResolvedValue(createdUser);
            vitest.spyOn(userMapper, "toPrivateUserDto").mockReturnValue(privateDto);

            const result = await authService.register(dto);

            expect(userService.isEmailAvailable).toHaveBeenCalledWith(dto.email);
            expect(hashingService.hash).toHaveBeenCalledWith(dto.password);
            expect(userService.create).toHaveBeenCalledWith({
                email: dto.email,
                name: dto.name,
                passwordHash: HASH_RESULT,
                role: Role.USER,
            });
            expect(userMapper.toPrivateUserDto).toHaveBeenCalledWith(createdUser);
            expect(result).toEqual(privateDto);
        });

        it("should throw ConflictException when an email already exists", async () => {
            vitest.spyOn(userService, "isEmailAvailable").mockResolvedValue(false);

            await expect(authService.register(dto)).rejects.toThrow(ConflictException);
            expect(userService.isEmailAvailable).toHaveBeenCalledWith(dto.email);
        });
    });

    describe("login", () => {
        let dto: LoginDTO;
        let userFound: User;
        beforeEach(() => {
            dto = { email: "joao@email.com", password: "!@123Abc" };
            userFound = userFactory({ email: dto.email, passwordHash: HASH_RESULT });
        });

        it("should log in", async () => {
            const { passwordHash: _, ...privateDto } = userFound;

            vitest.spyOn(hashingService, "compare").mockResolvedValue(true);
            vitest.spyOn(userService, "findInternalByEmail").mockResolvedValue(userFound);
            vitest.spyOn(userMapper, "toPrivateUserDto").mockReturnValue(privateDto);
            vitest.spyOn(jwtService, "signAsync").mockResolvedValue(JWT_SIGN_RESULT);

            const result = await authService.login(dto);

            expect(userService.findInternalByEmail).toHaveBeenCalledWith(dto.email);
            expect(hashingService.compare).toHaveBeenCalledWith(dto.password, userFound.passwordHash);
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: userFound.id,
            });
            expect(userMapper.toPrivateUserDto).toHaveBeenCalledWith(userFound);
            expect(result).toEqual({ user: privateDto, accessToken: JWT_SIGN_RESULT });
        });

        it("should throw UnauthorizedException if the user doesn't exists", async () => {
            vitest.spyOn(userService, "findInternalByEmail").mockResolvedValue(null);

            await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
            expect(userService.findInternalByEmail).toHaveBeenCalledWith(dto.email);
        });

        it("should throw UnauthorizedException if the user's password is wrong", async () => {
            vitest.spyOn(userService, "findInternalByEmail").mockResolvedValue(userFound);
            vitest.spyOn(hashingService, "compare").mockResolvedValue(false);

            await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
            expect(userService.findInternalByEmail).toHaveBeenCalledWith(dto.email);
            expect(hashingService.compare).toHaveBeenCalledWith(dto.password, userFound.passwordHash);
        });
    });
});
