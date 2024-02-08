/** @type { import("eslint").Linter.BaseConfig } */
module.exports = {
  extends: ["semistandard", "standard"],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    eqeqeq: "warning",
  },
};
