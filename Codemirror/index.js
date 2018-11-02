const { Stream: $ } = require('xstream')
const complement = require('ramda/src/complement')
const when = require("ramda/src/when")
const objOf = require("ramda/src/objOf")
const prop = require("ramda/src/prop")
const dropRepeats = require('xstream/extra/dropRepeats').default
const { div, textarea } = require('@cycle/dom')
const isString = require('lodash/isString')
const { FromEvent } = require("monocycle/utilities/fromEvent")
const log = require("monocycle/utilities/log").Log('Codemirror')

const Codemirror = require('./codemirror')
const { WithTextarea } = require('../Textarea')



const fromEvent = FromEvent({
  on: 'on',
  off: 'off'
})

const DefaultTextarea = sources => ({
  DOM: $.of(textarea()),
})

const WithCodemirror = ({
  Textarea = DefaultTextarea,
  has,
  from,
  viewOptions = {},
  ...codemirrorOptions
} = {}, Cycle) => {

  if (typeof navigator === 'undefined')
    return WithTextarea()

  return component => Cycle(component)
    .concat(Textarea, {
      ...viewOptions,
      View: div.bind(void 0, `.codemirror`, viewOptions)
    })
    .after((sinks, sources) => {

      const codemirror$ = sources.DOM.select('textarea').element()
        .compose(dropRepeats((x, y) => x === y))
        .filter(complement(prop('editor')))
        .map(log.partial('textarea'))
        .map(textarea => textarea.editor = Codemirror.fromTextArea(textarea, {
          mode: 'gfm',
          lineNumbers: true,
          ...codemirrorOptions
        }))
        .compose(sources.Time.debounce(0))
        .map(Cycle.log.partial('Codemirror: instance:'))
        .map(instance => instance.refresh() || instance)
        .compose(dropRepeats())
        .replaceError(err => console.error('Cannot create editor because:', err.stack) || $.of())
        .remember()

      codemirror$
        .map(editor => {
          return (from ? from(sinks, sources) : $.of(has))
            .compose(dropRepeats())
            .map(when(isString, objOf('value')))
            .map(({ value, cursor }) => {
              editor.setValue(value)
              cursor && editor.setCursor(cursor)
            })
        })
        .flatten()
        .addListener(x => x)

      return ({
        ...sinks,
        codemirror$,
      })
    })

    .listener({
      from: (sinks, sources) => sinks.codemirror$.map(fromEvent('change'))
        .flatten(),
      to: 'change$'
    })

    .listener({
      from: (sinks, sources) => sinks.codemirror$.map(fromEvent('cursorActivity'))
        .flatten(),
      to: 'cursorActivity$'
    })
}


module.exports = {
  default: WithCodemirror,
  WithCodemirror,
  fromEvent
}
