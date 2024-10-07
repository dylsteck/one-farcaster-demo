CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY,
    "fid" integer UNIQUE,
    "username" varchar(50) NOT NULL UNIQUE,
    "display_name" varchar(50) NOT NULL,
    "signer_uuid" varchar(255) NOT NULL UNIQUE,
    "verified_address" varchar(255) DEFAULT '' UNIQUE,
    "bio" text DEFAULT '',
    "pfp_url" varchar(255) DEFAULT '',
    "created_at" timestamp DEFAULT now()
);