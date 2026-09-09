CREATE TABLE "Product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(150) NOT NULL,
	"description" varchar(3000) NOT NULL,
	"price" numeric(12,2) NOT NULL,
	"stock" integer NOT NULL,
	"active" boolean NOT NULL,
	"categoryId" uuid,
	"createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_Category_id_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id");