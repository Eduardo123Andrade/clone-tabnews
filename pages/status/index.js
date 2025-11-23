import useSWR from "swr";

const fetchApi = async (key) => {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
};

const UpdatedAt = () => {
  /**
   * the SWR use a "key strategy" to define a key for a request
   * this way, if someone do a request to the same key, the SWR
   * will use the cached value
   *
   * by default this approach use 2 second, but can change using
   * the property: dedupingInterval
   */
  const { data, isLoading } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2_000,
  });

  let updatedAtText = "Carregando...";

  if (!!data && !isLoading) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
};

const DataBaseStatus = () => {
  const { data, isLoading } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2_000,
  });
  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões maximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Database</h2>

      <div>{databaseStatusInformation}</div>
    </>
  );
};

const StatusPage = () => {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DataBaseStatus />
    </>
  );
};

export default StatusPage;
