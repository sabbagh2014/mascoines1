module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: "plugin:react/recommended",
    globals: {
      Atomics: "readonly",
      SharedArrayBuffer: "readonly",
    },
    parser: "@babel/eslint-parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: "module",
    },
    plugins: ["react"],
    rules: {
      "react/prop-types": 0,
    },
  };
  