/**
 * Arquivo para definir as configurações do jest
 *
 */

const dotenv = require("dotenv");
const nextJest = require("next/jest");

dotenv.config({
  path: '.env.development'
})

const createJestConfig = nextJest({
  dir: "./",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // testEnvironment: "jest-environment-jsdom",
});

module.exports = jestConfig;
