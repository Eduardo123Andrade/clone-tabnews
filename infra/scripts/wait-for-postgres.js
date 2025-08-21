const { exec } = require("node:child_process");

const handleReturn = (error, stdout, stderr) => {
  if (stdout.search("accepting connections") === -1) {
    process.stdout.write(".");
    checkPostgres();
    return;
  }
  console.log("\n🟢 Postgres está pronto e aceitando conexões\n");
};

const checkPostgres = () => {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
};

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");
//

checkPostgres();
