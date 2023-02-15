const {defaults} = require('jest-config');
module.exports = {
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.{js,jsx,ts,tsx}"],
  "coverageThreshold": {
    "global": {
      "lines": 80,
      "statements": 80
    }
  },
  testTimeout: 30000,
  globals: {
    window: {
      location: {
        host: "localhost:9000",
      },
      innerWidth: 600,
    },
    "ts-jest": {
      useBabelrc: true,
      tsConfigFile: "jest.tsconfig.json",
    },
    google: {
      maps: {},
    },
  },
  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.(css|scss)$": "<rootDir>/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|css|json)$)": "<rootDir>/jest/fileTransform.js",
  },
  moduleNameMapper: {
    '^image![a-zA-Z0-9$_-]+$': 'GlobalImageStub',
    '^[./a-zA-Z0-9$_-]+\\.png$': '<rootDir>/RelativeImageStub.js',
    'module_name_(.*)': '<rootDir>/substituted_module_$1.js',
    'assets/(.*)': [
      '<rootDir>/images/$1',
      '<rootDir>/photos/$1',
      '<rootDir>/recipes/$1',
    ],
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/libs/",
    "/styles/",
    "/constants/",
    "/test-helpers/",
    "/widgets/",
    "/outputs/",
    "/store/reducer/index.js",
    "/store/store.js",
    "/config.js",
    "/setupTests.js",
    "/reportWebVitals.js",
    "/tools/split/"
  ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', 'cts',"ts", "tsx", "js","jsx"],
  testMatch: ["**/*.(test|spec).(js|jsx)"],
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  testEnvironment: 'jsdom',
  setupFiles: ["<rootDir>/jest/setup.js"],
  setupFilesAfterEnv: [ "<rootDir>/src/setupTests.js" ],
  globalSetup: "<rootDir>/jest/jestEnvVar.js",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  coverageReporters: ["json", "lcov", "text", "text-summary", "html"],
};
