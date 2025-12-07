import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator";

const fetchStatusPage = async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  if (response.status !== 200) {
    throw new Error();
  }
};

const waitForWebServer = async () => {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 5000,
  });
};

const waitForAllServices = async () => {
  await waitForWebServer();
};

const clearDatabase = async () => {
  await database.query("drop schema public cascade; create schema public");
};


const runPendingMigrations = async () => {
  await migrator.runPendingMigrations()
}

const orquestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations
};

export default orquestrator;
