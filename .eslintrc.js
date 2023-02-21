module.exports = {
  "env": {
    "browser": true,
    "jest": true,
    "node": true
  },
  "parser": "@babel/eslint-parser",
  "extends": [
    "airbnb",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",],
  "rules": {
    "no-underscore-dangle": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": 1,
    "no-await-in-loop": 0,
    "react/jsx-props-no-spreading": 0,
    "react/state-in-constructor": 0,
    "no-use-before-define": 0,
    "no-shadow": 0,
    "quotes": 0,
    "jsx-a11y/mouse-events-have-key-events": 0,
    "consistent-return": 0,
    "array-callback-return": 0,
    "no-undef": 0,
    "react/no-array-index-key": 0,
    "no-param-reassign": 0,
    "global-require": 0
  },
  "plugins": ["react"],
  "parserOptions": {
    "ecmaVersion": 8,
    "requireConfigFile": false,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "impliedStrict": true,
      "classes": true
    },
  },
  "settings": {
    "import/resolver": "webpack",
  },
  ignorePatterns: ['src/hra/*']
}
