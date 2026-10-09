module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/testing/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }],
  },
};