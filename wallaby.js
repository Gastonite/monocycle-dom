module.exports = function () {
  return {
    files: [
      '**/*.js',
      '!**/*.spec.js',
      '!node_modules/**/*',
      '!old/**/*',
    ],

    tests: [
      // 'Button/*spec.js',
      // 'View/*spec.js',
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
