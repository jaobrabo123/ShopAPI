CREATE TYPE "UserRole" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"passwordHash" varchar(255) NOT NULL,
	"role" "UserRole",
	"createdAt" timestamp(6) with time zone DEFAULT now(),
	"updatedAt" timestamp(6) with time zone DEFAULT now()
);
