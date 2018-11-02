const { makeReplacer } = require('../Replacer')
const { WithIconButton } = require('components/IconButton')
const imageIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/image.svg'), 'utf8');

const makeDrawImageButton = ({ classes } = {}) =>
  makeReplacer({
    type: 'image',
    start: '![',
    end: ']()',
  })
    .map(WithIconButton({ classes, has: imageIcon }))

module.exports = {
  default: makeDrawImageButton,
  makeDrawImageButton,
}