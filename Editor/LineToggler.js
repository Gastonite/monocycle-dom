const { Stream: $ } = require('xstream')
const Component = require('component')
const range = require('ramda/src/range')
const { WithSetReducer } = require("./SetReducer")
const { WithClickable } = require("components/Clickable")
const { WithTypeWatcher, hasTokenType } = require("./TypeWatcher")


const WithLineToggler = ({
  type,
  delimiter = '',
  pattern
} = {}) => {

  return f => Component(f, 'LineTogglerButton')
    .map(WithClickable())
    .map(WithTypeWatcher({
      type,
      check: (editor, type) => {

        const line = editor.getLine(editor.getCursor().line)

        console.log('check', {
          line,
          pattern,
          test: pattern.test(line)
        })
        return pattern.test(line)
      },
      to: 'isTypeActive$'
    }))
    .map(WithSetReducer({ key: 'active', from: 'isTypeActive$' }))
    .listener({
      name: 'EditorLineToggler',
      from: (sinks, { codemirror$ = $.empty() }) => codemirror$.map(editor => {
        return sinks.click$
          // .debug('click')
          .map(event => {

            const token = editor.getTokenAt(editor.getCursor())
            const startPoint = editor.getCursor("start")
            const endPoint = editor.getCursor("end")

            range(startPoint.line, endPoint.line + 1).forEach(i => {

              const line = editor.getLine(i)

              const text = hasTokenType(token, type)
                ? line.replace(pattern, "$1")
                : delimiter + line

              editor.replaceRange(text,
                { line: i, ch: 0 },
                { line: i, ch: line.length + delimiter.length }
              )
            })

            editor.focus()
          })
      }).flatten()
    })
}

module.exports = {
  default: WithLineToggler,
  WithLineToggler,
}