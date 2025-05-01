CREATE TABLE "memorial_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"country" text DEFAULT 'Canada' NOT NULL,
	"email" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
