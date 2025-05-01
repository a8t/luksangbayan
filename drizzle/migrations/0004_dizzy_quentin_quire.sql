ALTER TABLE "vigil_events" ALTER COLUMN "city" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "vigil_events" ALTER COLUMN "province" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "vigil_events" ALTER COLUMN "time" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "vigil_events" ADD COLUMN "image" text;