CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"github_name" text,
	"name" text NOT NULL,
	"description" text,
	"url" text NOT NULL,
	"language" text,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_github_name_unique" UNIQUE("github_name")
);
--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;