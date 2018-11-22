module.exports = function () {
  return {
    files: [
      '**/*.js',
      '!**/*.spec.js',
      '!node_modules/**/*',
      '!old/**/*',
    ],

    tests: [
      '**/*spec.js',
      '!node_modules/**/*',
    ],
    env: {
      type: 'node'
    },
    testFramework: 'ava',
    setup: function (wallaby) {

    }
  };
};
