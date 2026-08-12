import { Client } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for db:reset:test");

const client = new Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query("drop schema if exists drizzle cascade");
  await client.query("drop schema if exists public cascade");
  await client.query("create schema public");
} finally {
  await client.end();
}
