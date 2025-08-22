import retry from "async-retry";

const fetchStatusPage = async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
};

const waitForWebServer = async () => {
  return retry(fetchStatusPage, {
    retries: 100,
  });
};

const waitForAllServices = async () => {
  await waitForWebServer();
};

export default {
  waitForAllServices,
};
