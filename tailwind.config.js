const { theme } = require('@dawnlight/ui-web')

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/@dawnlight/ui-web/**/*.js'],
  ...theme,
}
