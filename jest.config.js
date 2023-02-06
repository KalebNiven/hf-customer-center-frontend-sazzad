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
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/*.(test|spec).(js|jsx)"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["<rootDir>/jest/setup.js"],
  globalSetup: "<rootDir>/jest/jestEnvVar.js",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  coverageReporters: ["json", "lcov", "text", "text-summary", "html"],
  reporters: [
    "default",
    [
      "./node_modules/jest-junit",
      {
        outputName: "test-report.xml",
      },
    ],
  ],
};
