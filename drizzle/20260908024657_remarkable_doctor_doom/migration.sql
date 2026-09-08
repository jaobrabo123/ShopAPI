ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE varchar(150) USING "name"::varchar(150);--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;