import { Client } from "pg";

async function query(args) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();

  const result = await client.query(args);
  await client.end();

  return result;
}

export default {
  query,
};
