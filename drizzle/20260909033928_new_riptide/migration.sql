CREATE TABLE "Category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL UNIQUE,
	"createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL
);
