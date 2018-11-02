const { Stream: $ } = require('xstream')
const { FromEvent } = require("utilities/fromEvent")
const dropRepeats = require("xstream/extra/dropRepeats").default
const castArray = require('lodash/castArray')
const returnTrue = require('ramda/src/T')
const Component = require('component')

const fromEvent = FromEvent({
  on: 'on',
  off: 'off'
})

const WithTypeWatcher = ({
  to = 'isTypeActive$',
  type,
  check = returnTrue
} = {}) => {

  return f => Component(f)
    .after((sinks, { codemirror$ = $.empty() }) => ({
      ...sinks,
      [to]: codemirror$
        .map(fromEvent('cursorActivity'))
        .flatten()
        .map(editor => {

          const word = editor.findWordAt(editor.getCursor())
          const text = editor.getRange(word.anchor, word.head)
          const token = editor.getTokenAt(word.anchor)
          const types = (token.type || '').split(' ')

          // console.log('activity', { ...token, word, text, types })

          return hasTokenType(token, type, check.bind(null, editor))
        })
        .compose(dropRepeats())
        .remember()
    }))
}

const hasTokenType = (token, type, check = returnTrue) => {
  const types = (token.type || '').split(' ')

  return castArray(type).some(type => types.includes(type) && check(type))
}

const makeTypeWatcher = options => WithTypeWatcher(options)()

module.exports = {
  default: makeTypeWatcher(),
  makeTypeWatcher,
  WithTypeWatcher,
  hasTokenType,
}