/* eslint-disable no-undef */
import database from "infra/database.js";
import { NotFoundError, ValidationError } from "infra/errors.js";

const runInsertQuery = async (userInputValues) => {
  const result = await database.query({
    text: `
        INSERT INTO 
          users (username, email, password) 
        VALUES 
          ($1, $2, $3) 
        RETURNING *;
      `,
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });

  return result.rows[0];
};

const validateUniqueEmail = async (email) => {
  const result = await database.query({
    text: `
        SELECT 
          email 
        FROM 
          users 
        WHERE
          LOWER(email) = LOWER($1);
      `,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O email informado já está sendo utilizado",
      action: "Utilize outro email para realizar o cadastro",
    });
  }
};

const validateUniqueUserName = async (username) => {
  const result = await database.query({
    text: `
        SELECT 
          username 
        FROM 
          users 
        WHERE
          LOWER(username) = LOWER($1);
      `,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "O nome de usuário informado já está sendo utilizado",
      action: "Utilize outro nome de usuário para realizar o cadastro",
    });
  }
};

const runSelectQuery = async (username) => {
  const result = await database.query({
    text: `
        SELECT 
          username,
          email,
          id
        FROM 
          users 
        WHERE
          LOWER(username) = LOWER($1) 
        LIMIT
          1;
      `,
    values: [username],
  });

  if (!result.rowCount) {
    throw new NotFoundError({
      message: "O username informado não foi encontrado no sistema.",
      action: "Verifique se o username está digitado corretamente.",
    });
  }

  return result.rows[0];
};

const create = async (userInputValues) => {
  await Promise.all([
    validateUniqueEmail(userInputValues.email),
    validateUniqueUserName(userInputValues.username),
  ]);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;
};

const findOneByUsername = async (username) => {
  const result = await runSelectQuery(username);
  return result;
};

const user = {
  create,
  findOneByUsername,
};

export default user;
