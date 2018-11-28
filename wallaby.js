module.exports = function () {
  return {
    files: [
      '**/*.js',
      '!**/*.spec.js',
      '!**/node_modules/**/*',
      'node_modules/monocycle/**/*.js',
      'node_modules/monocycle-abstract/**/*.js',
      '!old/**/*',
    ],

    tests: [
      // 'Button/*spec.js',
      // 'View/*spec.js',
      // 'Clickable/*spec.js',
      '**/*spec.js',
      '!node_modules/**/*',
    ],
    env: {
      type: 'node'
    },
    testFramework: 'ava',
    setup: wallaby => {

    },
    debug: true
  }
}
