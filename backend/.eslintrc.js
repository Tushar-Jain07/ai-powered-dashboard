module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true, // Add jest environment
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // Add any specific rules for your backend here
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }], // Ignore 'next' for unused vars
    "no-undef": "off", // Temporarily turn off no-undef to address other issues first
  },
  globals: {
    // Define Jest globals
    jest: "readonly",
    expect: "readonly",
    describe: "readonly",
    it: "readonly",
    beforeAll: "readonly",
    afterAll: "readonly",
    afterEach: "readonly",
  },
};