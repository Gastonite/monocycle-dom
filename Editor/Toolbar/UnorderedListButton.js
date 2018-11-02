const { makeLineToggler } = require('../LineToggler')
// const ulIcon = require('font-awesome-svg-png/black/svg/list-ul.svg')
const { WithIconButton } = require('components/IconButton')
const ulIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/list-ul.svg'), 'utf8');


const makeUnorderedListButton = ({ classes } = {}) =>
  makeLineToggler({
    type: 'variable-2',
    delimiter: '* ',
    pattern: /^(\s*)(\*|\-|\+)\s+/,
  })
    .map(WithIconButton({ classes, has: ulIcon }))

module.exports = {
  default: makeUnorderedListButton,
  makeUnorderedListButton,
}

module.exports = {
  default: makeUnorderedListButton,
  makeUnorderedListButton,
}