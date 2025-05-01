CREATE TYPE "public"."memorial_message_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "memorial_messages" ADD COLUMN "status" "memorial_message_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "memorial_messages" ADD COLUMN "moderated_at" timestamp;--> statement-breakpoint
ALTER TABLE "memorial_messages" ADD COLUMN "moderated_by" text;--> statement-breakpoint
ALTER TABLE "memorial_messages" ADD COLUMN "rejection_reason" text;