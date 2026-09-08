import { pgEnum, pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { Role } from "../../modules/user/enum/role.enum.js";

export const timestamps = {
    createdAt: timestamp({ precision: 6, withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ precision: 6, withTimezone: true }).defaultNow().notNull(),
};

export const roleEnum = pgEnum("UserRole", Role);

export const userTable = pgTable("User", {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar({ length: 150 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: varchar({ length: 255 }).notNull(),
    role: roleEnum().notNull(),
    ...timestamps,
});
