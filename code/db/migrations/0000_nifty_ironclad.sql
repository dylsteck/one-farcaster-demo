CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"fid" integer,
	"username" varchar(50) NOT NULL,
	"display_name" varchar(50) NOT NULL,
	"signer_uuid" varchar(255) NOT NULL,
	"verified_address" varchar(255) DEFAULT '',
	"bio" text DEFAULT '',
	"pfp_url" varchar(255) DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_fid_unique" UNIQUE("fid"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_signer_uuid_unique" UNIQUE("signer_uuid"),
	CONSTRAINT "users_verified_address_unique" UNIQUE("verified_address")
);
