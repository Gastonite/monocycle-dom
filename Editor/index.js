const { Stream: $ } = require('xstream')
const { WithCodemirror } = require('../Codemirror')
const { div, textarea } = require('@cycle/dom')
const { makeEditorToolbar } = require('./Toolbar')
const { FromEvent } = require("utilities/fromEvent")
const style = require('style')
const pipe = require('ramda/src/pipe')
const isObject = require('lodash/isObject')
const isFunction = require('lodash/isFunction')

const fromEvent = FromEvent({
  on: 'on',
  off: 'off'
})

const DefaultTextarea = sources => ({
  DOM: $.of(textarea()),
})

const DefaultEditorView = (...args) => div(`.${style.Editor}`, ...args)

/*
  const WithEditor1 = ({
    components,
    View = DefaultEditorView,
    ...codemirrorOptions
  } = {}) => {

    components = {
      Toolbar: DefaultToolbar,
      ...(isObject(components) ? components : {})
    }

    if (!isFunction(components.Toolbar))
      throw new Error(`'components.Toolbar' must be a function`)

    return component => Cycle(component)

      .concat(components.Toolbar)

      .after((sinks, sources) => ({
        ...sinks,
        codemirror$: sources.codemirror$
      }))

      .map(WithCodemirror({
        lineNumbers: false,
        Textarea: components.Textarea,
        ...codemirrorOptions,
        View,
      }))
  }
*/

const WithEditor = (options = {}, Cycle) => {

  const parseOptions = pipe(
    Cycle.coerce,
  )

  const {
    has,
    classes,
    ...codemirrorOptions
  } = parseOptions(options)

  return component => Cycle(component)

    .concat(makeEditorToolbar({
      classes,
      has
    }))

    .after((sinks, sources) => ({
      ...sinks,
      codemirror$: sources.codemirror$
    }))

    .map(WithCodemirror({
      theme: 'darcula',
      ...codemirrorOptions
    }))
}

module.exports = {
  default: WithEditor,
  WithEditor,
  fromEvent
}