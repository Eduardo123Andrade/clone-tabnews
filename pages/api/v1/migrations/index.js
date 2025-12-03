import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { createRouter } from "next-connect";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(handleGetMigrations).post(handlePostMigrations);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

const getCommonMigrationConfig = () => {
  const defaultMigrationOptions = {
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return defaultMigrationOptions;
};

async function handleGetMigrations(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const commonConfig = getCommonMigrationConfig();
    const defaultMigrationOptions = {
      dbClient,
      dryRun: true,
      ...commonConfig,
    };

    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    return response.status(200).json(pendingMigrations);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function handlePostMigrations(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const commonConfig = getCommonMigrationConfig();
    const defaultMigrationOptions = {
      dbClient,
      dryRun: false,
      ...commonConfig,
    };

    const migratedMigrations = await migrationRunner(defaultMigrationOptions);

    if (migratedMigrations.length) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  response.status(500).json(publicErrorObject);
}
