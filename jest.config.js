/**
 * @file Jest configuration.
 */

module.exports = {
  rootDir: 'src/test',
  testRegex: '/src/test/.*test\\.js$',
  setupFiles: ['<rootDir>/setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/styleMock.js"
  }
};
