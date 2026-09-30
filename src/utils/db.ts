import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/client";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is missing");
}

const connection = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: connection.hostname,
  port: Number(connection.port || 3306),
  user: decodeURIComponent(connection.username),
  password: decodeURIComponent(connection.password),
  database: decodeURIComponent(connection.pathname.slice(1)),
  connectionLimit: 5,
});     

export const prisma = new PrismaClient({ adapter });
