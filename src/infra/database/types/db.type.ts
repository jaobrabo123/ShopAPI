import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "../relations.js";

export type DB = NodePgDatabase<typeof relations> & {
    $client: Pool;
};
