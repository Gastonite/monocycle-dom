const { makeLineToggler } = require('../LineToggler')
const { WithIconButton } = require('components/IconButton')
const olIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/list-ol.svg'), 'utf8');


const makeOrderedListButton = ({ classes } = {}) =>
  makeLineToggler({
    type: 'variable-2',
    delimiter: '1. ',
    pattern: /^(\s*)\d+\.\s+/,
  })
    .map(WithIconButton({ classes, has: olIcon }))

module.exports = {
  default: makeOrderedListButton,
  makeOrderedListButton,
}
