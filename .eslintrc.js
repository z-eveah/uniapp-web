module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true,
  },
  extends: ["plugin:vue/vue3-recommended", "prettier", "prettier/vue"],
  plugins: ["prettier"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: false,
    },
  },
  globals: {
    Page: true,
    wx: true,
    App: true,
    uni: true,
  },
  rules: {
    "prettier/prettier": "error",
  },
};
