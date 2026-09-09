CREATE TYPE "OrderStatus" AS ENUM('PENDING', 'PAID', 'CANCELLED', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "OrderItem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"orderId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unityPrice" numeric(12,2) NOT NULL,
	"subtotal" numeric(12,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"status" "OrderStatus" NOT NULL,
	"total" numeric(12,2) NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"productId" uuid NOT NULL,
	"rating" smallint NOT NULL,
	"comment" varchar(500),
	"createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "OrderItem_orderId_productId_index" ON "OrderItem" ("orderId","productId");--> statement-breakpoint
CREATE UNIQUE INDEX "Review_userId_productId_index" ON "Review" ("userId","productId");--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_Order_id_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id");--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_Product_id_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id");--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_User_id_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_Product_id_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id");