const { makeInserter } = require('../Inserter')
const { WithIconButton } = require('components/IconButton')
const minusIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/minus.svg'), 'utf8');


const makeDrawHorizontalLineButton = ({ classes } = {}) =>
  makeInserter({
    type: 'horizontalRule',
    delimiter: '\n\n-----\n\n'
  })
    .map(WithIconButton({ classes, has: minusIcon }))


module.exports = {
  default: makeDrawHorizontalLineButton,
  makeDrawHorizontalLineButton,
}