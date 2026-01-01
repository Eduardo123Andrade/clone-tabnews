import bcryptjs from "bcryptjs";

const getNumberOfRounds = () => {
  if (process.env.NODE_ENV === "production") return 14;

  return 1;
};

const hash = async (password) => {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
};

const compare = async (providadePassword, storedPassword) => {
  console.log(!!bcryptjs, providadePassword, storedPassword);
  return await bcryptjs.compare(providadePassword, storedPassword);
};

const password = {
  hash,
  compare,
};

export default password;
