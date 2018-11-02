const { makeBlockToggler } = require('../BlockToggler')
const { WithIconButton } = require('components/IconButton')
const italicIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/italic.svg'), 'utf8');

const makeItalicButton = ({ classes  = {}}) =>
  makeBlockToggler({
    classes,
    type: 'em',
    delimiter: '*',
    patterns: {
      start: /(\*|_)(?![\s\S]*(\*|_))/,
      end: /(\*|_)/
    }
  })
    .map(WithIconButton({ classes, has: italicIcon }))
    // .isolation({
    //   DOM: 'ItalicButton',
    //   '*': null
    // })




module.exports = {
  default: makeItalicButton,
  makeItalicButton,
}