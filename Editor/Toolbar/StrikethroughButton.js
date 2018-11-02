const { makeBlockToggler } = require('../BlockToggler')
const { WithIconButton } = require('components/IconButton')
const strikethroughIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/strikethrough.svg'), 'utf8');


const makeStrikethroughButton = ({ classes } = {}) =>
  makeBlockToggler({
    type: 'strikethrough',
    delimiter: '~~',
    patterns: {
      start: /(\*\*|~~)(?![\s\S]*(\*\*|~~))/,
      end: /(\*\*|~~)/
    }
  })
    .map(WithIconButton({ classes, has: strikethroughIcon }))

module.exports = {
  default: makeStrikethroughButton,
  makeStrikethroughButton,
}