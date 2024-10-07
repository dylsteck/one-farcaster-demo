import { integer, serial, varchar, text, timestamp, pgTable } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fid: integer('fid').unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  displayName: varchar('display_name', { length: 50 }).notNull(),
  signerUuid: varchar('signer_uuid', { length: 255 }).notNull().unique(),
  verifiedAddress: varchar('verified_address', { length: 255 }).default('').unique(),
  bio: text('bio').default(''),
  pfpUrl: varchar('pfp_url', { length: 255 }).default(''),
  createdAt: timestamp('created_at').defaultNow(),
})