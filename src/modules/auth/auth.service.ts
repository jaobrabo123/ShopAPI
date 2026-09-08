import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service.js";
import { HashingService } from "./hashing/hashing.service.js";
import { UserMapper } from "../user/mappers/user.mapper.js";
import { CreateUserDto } from "../user/dto/create-user.dto.js";
import { PrivateUserDto } from "../user/dto/private-user.dto.js";
import { Role } from "../user/enum/role.enum.js";
import { LoginDTO } from "./dto/login.dto.js";
import { LoginResponseDto } from "./dto/login-response.dto.js";
import { JwtService } from "@nestjs/jwt";
import { TokenPayloadDTO } from "./dto/token-payload.dto.js";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly hashingService: HashingService,
        private readonly userMapper: UserMapper,
        private readonly jwtService: JwtService,
    ) {}

    private throwInvalidCredentials(): never {
        throw new UnauthorizedException("Invalid credentials");
    }

    async register(dto: CreateUserDto): Promise<PrivateUserDto> {
        const emailAvailable = await this.userService.isEmailAvailable(dto.email);
        if (!emailAvailable) {
            throw new ConflictException("This email address is already in use");
        }

        const passwordHash = await this.hashingService.hash(dto.password);
        const user = await this.userService.create({ email: dto.email, name: dto.name, passwordHash, role: Role.USER });
        return this.userMapper.toPrivateUserDto(user);
    }

    async login(dto: LoginDTO): Promise<LoginResponseDto> {
        const user = await this.userService.findInternalByEmail(dto.email);
        if (!user) this.throwInvalidCredentials();

        const validPassword = await this.hashingService.compare(dto.password, user.passwordHash);
        if (!validPassword) this.throwInvalidCredentials();

        const accessToken = await this.jwtService.signAsync<TokenPayloadDTO>({ sub: user.id });

        return {
            accessToken,
            user: this.userMapper.toPrivateUserDto(user),
        };
    }
}
