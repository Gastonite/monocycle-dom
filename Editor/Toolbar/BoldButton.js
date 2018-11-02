const { makeBlockToggler } = require('../BlockToggler')
const { WithIconButton } = require('components/IconButton')
const boldIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/bold.svg'), 'utf8');

const makeBoldButton = ({ classes } = {}) =>
  makeBlockToggler({
    classes,
    type: 'strong',
    delimiter: '**',
    patterns: {
      start: /(\*\*|__)(?![\s\S]*(\*\*|__))/,
      end: /(\*\*|__)/
    }
  })
    .map(WithIconButton({ classes, has: boldIcon }))

module.exports = {
  default: makeBoldButton,
  makeBoldButton,
}