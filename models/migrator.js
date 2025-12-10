import { resolve } from "node:path";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";

// TODO - desafio dia 40 aula  01 - Colocar o erro de serviço (Assistir o minuto 16)

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  migrationsTable: "pgmigrations",
  log: () => {},
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const config = {
      ...defaultMigrationOptions,
      dbClient,
    };

    const pendingMigrations = await migrationRunner(config);
    return pendingMigrations;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const config = {
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient,
    };

    const migratedMigrations = await migrationRunner(config);

    return migratedMigrations;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
