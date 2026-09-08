import { TablesRelationalConfig } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export type DB = NodePgDatabase<TablesRelationalConfig> & {
    $client: Pool;
};
