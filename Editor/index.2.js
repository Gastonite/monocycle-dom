const { Stream: $ } = require('xstream')
const complement = require('ramda/src/complement')
const Component = require('component')
const prop = require("ramda/src/prop")
const Codemirror = require('codemirror')
import "codemirror/addon/edit/continuelist.js"
import "codemirror/addon/display/fullscreen.js"
import "codemirror/mode/markdown/markdown.js"
import "codemirror/addon/mode/overlay.js"
import "codemirror/addon/display/placeholder.js"
import "codemirror/addon/selection/mark-selection.js"
import "codemirror/mode/gfm/gfm.js"
import "codemirror/mode/xml/xml.js"
const dropRepeats = require('xstream/extra/dropRepeats').default
const { div, textarea } = require('@cycle/dom')
const DefaultToolbar = require('./Toolbar')
const { FromEvent } = require("utilities/fromEvent")

export const fromEvent = FromEvent({
  on: 'on',
  off: 'off'
})

const DefaultTextarea = sources => ({
  DOM: $.of(textarea()),
})

export const WithEditor = ({
  View = div,
  Textarea = DefaultTextarea,
  Toolbar = DefaultToolbar,
  codemirrorOptions = {
    mode: 'gfm',
  },
} = {}) => {

  return component => Component(component)
    .concat(Toolbar
      .isolation('toolbar')
      .concat(Textarea, { View })
      .after((sinks, sources) => ({
        ...sinks,
        editor$: sources.codemirror$
      }))
      .before(sources => ({
        ...sources,
        codemirror$: sources.DOM.select('textarea').element()
          .compose(dropRepeats((x, y) => x === y))
          .filter(complement(prop('editor')))
          .map(textarea => console.log('biip.textarea', { editor: textarea.editor }) || textarea)
          .map(textarea => textarea.editor = Codemirror.fromTextArea(textarea, codemirrorOptions))
          .replaceError(err => console.error('Cannot instanciate Codemirror editor', err))
          .compose(sources.Time.debounce(0))
          .map(editor => editor.setOption("theme", 'darcula') || editor)
          .map(instance => instance.refresh() || instance)
          .compose(dropRepeats())
          .remember()
      })))
}

export const makeEditor = options => WithEditor(options)()

export default makeEditor()

