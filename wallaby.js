module.exports = function () {
  return {
    files: [
      '**/*.js',
      '!**/test.js',
      '!**/test/index.js',
      '!node_modules/**/*',

    ],

    tests: [
      '**/test.js',
      '**/test/index.js',
      '!node_modules/**/*',
    ],
    env: {
      type: 'node'
    },
    setup: function (wallaby) {
      // console.log('setup', wallaby)
      var mocha = wallaby.testFramework;

      mocha.ui('tdd');

      
      mocha.timeout(5000);
      // etc.
      // require('module-alias/register')

    }
  };
};
