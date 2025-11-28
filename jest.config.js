const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    "<rootDir>/app/**/*.{ts,tsx}",
    "<rootDir>/components/**/*.{ts,tsx}",
    "<rootDir>/lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
}

module.exports = createJestConfig(customJestConfig)
