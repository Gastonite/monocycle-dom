const { makeReplacer } = require('../Replacer')
const { WithIconButton } = require('components/IconButton')
const linkIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/link.svg'), 'utf8');

const makeDrawLinkButton = ({ classes } = {}) =>
  makeReplacer({
    type: 'link',
    start: '[',
    end: ']()',
  })
    .map(WithIconButton({ classes, has: linkIcon }))

module.exports = {
  default: makeDrawLinkButton,
  makeDrawLinkButton,
}