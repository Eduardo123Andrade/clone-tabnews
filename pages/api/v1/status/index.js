import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const result = await database.query("SHOW server_version;");
  const dataBaseVersionValue = result.rows[0].server_version;
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const databaseOpenConnectionsResults = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenConnectionsValue =
    databaseOpenConnectionsResults.rows[0].count;
  return response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        open_connections: databaseOpenConnectionsValue,
      },
    },
  });
}

export default status;
