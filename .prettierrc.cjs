/** @type {import("prettier").Options} */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
  plugins: [require.resolve('prettier-plugin-organize-imports'), require.resolve('prettier-plugin-tailwindcss')],
};
