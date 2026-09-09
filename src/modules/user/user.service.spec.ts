import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service.js";
import { UserMapper } from "./mappers/user.mapper.js";
import userFactory from "./test/factories/user.factory.js";
import { DB_PROVIDER } from "../../infra/database/constants/db-provider.constant.js";
import { DB } from "../../infra/database/types/db.type.js";
import insertChainFactory from "./test/factories/insert-chain.factory.js";
import { Role } from "./enum/role.enum.js";
import { TokenPayloadDTO } from "../auth/dto/token-payload.dto.js";
import { NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import updateChainFactory from "./test/factories/update-chain.factory.js";

describe("UserService", () => {
    let userService: UserService;
    let userMapper: UserMapper;
    let db: DB;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: UserMapper, useValue: { toPrivateUserDto: vitest.fn() } },
                {
                    provide: DB_PROVIDER,
                    useValue: {
                        query: { userTable: { findFirst: vitest.fn() } },
                        insert: vitest.fn(),
                        update: vitest.fn(),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userMapper = module.get<UserMapper>(UserMapper);
        db = module.get<DB>(DB_PROVIDER);
    });

    it("should be defined", () => {
        expect(userService).toBeDefined();
    });

    describe("isEmailAvailable", () => {
        it("should return true if the email is available", async () => {
            vitest.spyOn(db.query.userTable, "findFirst").mockResolvedValue(undefined);

            const email = "some@email.com";

            const result = await userService.isEmailAvailable(email);

            expect(db.query.userTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { email } }));
            expect(result).toBe(true);
        });

        it("should return false if the email is not available", async () => {
            vitest.spyOn(db.query.userTable, "findFirst").mockResolvedValue(userFactory());

            const email = "some@email.com";

            const result = await userService.isEmailAvailable(email);

            expect(db.query.userTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { email } }));
            expect(result).toBe(false);
        });
    });

    describe("findInternalByEmail", () => {
        it("should return the user with the provided email if exists", async () => {
            const email = "some@email.com";
            const user = userFactory({ email });

            vitest.spyOn(db.query.userTable, "findFirst").mockResolvedValue(user);

            const result = await userService.findInternalByEmail(email);

            expect(db.query.userTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { email } }));
            expect(result).toBe(user);
        });

        it("should return null if a user with the provided email doesn't exists", async () => {
            vitest.spyOn(db.query.userTable, "findFirst").mockResolvedValue(undefined);

            const email = "some@email.com";

            const result = await userService.findInternalByEmail(email);

            expect(db.query.userTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { email } }));
            expect(result).toBe(null);
        });
    });

    describe("create", () => {
        it("should insert a user and return it", async () => {
            const createDto = {
                email: "some@email.com",
                name: "SomeGuy",
                passwordHash: "123656172376",
                role: Role.USER,
            };

            const insertedUser = userFactory(createDto);
            const { valuesMock, returningMock } = insertChainFactory(db, [insertedUser]);

            const result = await userService.create(createDto);

            expect(valuesMock).toHaveBeenCalledWith(createDto);
            expect(returningMock).toHaveBeenCalledOnce();
            expect(result).toEqual(insertedUser);
        });
    });

    describe("findMe", () => {
        it("should return the user if found", async () => {
            const tokenPayload: TokenPayloadDTO = { role: Role.USER, sub: "uuid" };
            const user = userFactory({ role: tokenPayload.role, id: tokenPayload.sub });
            const { passwordHash: _, ...privateDto } = user;

            vitest.spyOn(userService, "findInternalById").mockResolvedValue(user);
            vitest.spyOn(userMapper, "toPrivateUserDto").mockResolvedValue(privateDto);

            const result = await userService.findMe(tokenPayload);

            expect(userService.findInternalById).toHaveBeenCalledWith(tokenPayload.sub);
            expect(userMapper.toPrivateUserDto).toHaveBeenCalledWith(user);
            expect(result).toBe(privateDto);
        });

        it("should throw NotFoundException if the user doesn't exists", async () => {
            const tokenPayload: TokenPayloadDTO = { role: Role.USER, sub: "uuid" };

            vitest.spyOn(userService, "findInternalById").mockResolvedValue(null);

            await expect(userService.findMe(tokenPayload)).rejects.toThrow(NotFoundException);
            expect(userService.findInternalById).toHaveBeenCalledWith(tokenPayload.sub);
        });
    });

    describe("updateMe", () => {
        it("should update and return the user if found", async () => {
            const tokenPayload: TokenPayloadDTO = { role: Role.USER, sub: "uuid" };
            const user = userFactory({ role: tokenPayload.role, id: tokenPayload.sub });
            const updateUserDto: UpdateUserDto = { name: "Peter", password: "peter123" };
            const updatedUser = { ...user, ...updateUserDto };
            const { passwordHash: _, ...privateDto } = updatedUser;

            const { setMock, returningMock } = updateChainFactory(db, [updatedUser]);

            vitest.spyOn(userService, "findInternalById").mockResolvedValue(user);
            vitest.spyOn(userMapper, "toPrivateUserDto").mockResolvedValue(privateDto);

            const result = await userService.updateMe(tokenPayload, updateUserDto);

            expect(setMock).toHaveBeenCalledWith(updateUserDto);
            expect(returningMock).toHaveBeenCalledOnce();
            expect(userService.findInternalById).toHaveBeenCalledWith(tokenPayload.sub);
            expect(userMapper.toPrivateUserDto).toHaveBeenCalledWith(updatedUser);
            expect(result).toBe(privateDto);
        });

        it("should throw NotFoundException if the user doesn't exists", async () => {
            const tokenPayload: TokenPayloadDTO = { role: Role.USER, sub: "uuid" };

            const { setMock } = updateChainFactory(db, []);

            vitest.spyOn(userService, "findInternalById").mockResolvedValue(null);

            await expect(userService.findMe(tokenPayload)).rejects.toThrow(NotFoundException);
            expect(userService.findInternalById).toHaveBeenCalledWith(tokenPayload.sub);
            expect(setMock).not.toHaveBeenCalled();
        });
    });
});
