import { SetMetadata } from "@nestjs/common";
import { Role } from "../../../modules/user/enum/role.enum.js";

export const REQUIRE_ROLES_KEY = "REQUIRE_ROLES_KEY";
export const RequireRoles = (...roles: Role[]) => SetMetadata(REQUIRE_ROLES_KEY, roles);
