const { makeBar } = require('components/Bar')
const { makeBoldButton } = require('./BoldButton')
const { makeItalicButton } = require('./ItalicButton')
const { makeStrikethroughButton } = require('./StrikethroughButton')
const { makeHeadingButton } = require('./HeadingButton')
const { makeUnorderedListButton } = require('./UnorderedListButton')
const { makeOrderedListButton } = require('./OrderedListButton')
const { makeQuoteButton } = require('./QuoteButton')
const { makeDrawLinkButton } = require('./DrawLinkButton')
const { DebugState } = require('components/Debug')
const { makeDrawImageButton } = require('./DrawImageButton')
const { makeDrawHorizontalLineButton } = require('./DrawHorizontalLineButton')
const { WithBar } = require('components/Bar')

const WithEditorToolbar = ({
  classes = {}
} = {} = {}) => {

  return WithBar({
    classes,
    noAdapt: true,
    has: [
      // DebugState,
      makeBoldButton({ classes }).isolation('boldButton'),
      makeItalicButton({ classes }).isolation('italicButton'),
      makeStrikethroughButton({ classes }).isolation('strikethroughButton'),
      makeHeadingButton({ classes }).isolation('headingButton'),
      makeUnorderedListButton({ classes }).isolation('unorderedListButton'),
      makeOrderedListButton({ classes }).isolation('orderedListButton'),
      makeQuoteButton({ classes }).isolation('quoteButton'),
      makeDrawLinkButton({ classes }).isolation('drawLinkButton'),
      makeDrawImageButton({ classes }).isolation('drawImageButton'),
      makeDrawHorizontalLineButton({ classes }).isolation('drawHorizontalLineButton')
    ]
  })
}

const makeEditorToolbar = options => WithEditorToolbar(options)()

module.exports = {
  default: makeEditorToolbar,
  makeEditorToolbar,
  WithEditorToolbar
}