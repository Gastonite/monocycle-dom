// const { WithLineToggler } = require('../LineToggler')
// const { makeIconButton } = require('components/IconButton')
// var fs = require('fs');
// var quoteIcon = fs.readFileSync(require.resolve('font-awesome-svg-png/black/svg/quote-right.svg'), 'utf8');


// const QuoteButton = makeIconButton(quoteIcon)
//   .map(WithLineToggler({
//     type: ['atom', 'quote'],
//     delimiter: '> ',
//     pattern: /^(\s*)\>\s+/,
//   }))

// module.exports = {
//   default: QuoteButton,
//   QuoteButton,
// }

const { makeLineToggler } = require('../LineToggler')
const { WithIconButton } = require('components/IconButton')
const quoteIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/quote-right.svg'), 'utf8');


const makeQuoteButton = ({ classes } = {}) =>
  makeLineToggler({
    type: ['atom', 'quote'],
    delimiter: '> ',
    pattern: /^(\s*)\>\s+/,
  })
    .map(WithIconButton({ classes, has: quoteIcon }))

module.exports = {
  default: makeQuoteButton,
  makeQuoteButton,
}
