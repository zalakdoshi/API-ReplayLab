module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "warn"
  },
  overrides: [
    {
      files: ["__tests__/**/*.js", "*.test.js", "*.spec.js"],
      env: {
        jest: true
      }
    }
  ]
};
