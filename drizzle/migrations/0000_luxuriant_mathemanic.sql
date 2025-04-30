CREATE TABLE "vigil_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"location" text NOT NULL,
	"details" text NOT NULL,
	"organizers" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
