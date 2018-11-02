const { Stream: $ } = require('xstream')
const { WithSetReducer } = require("./SetReducer")
const { WithTypeWatcher, hasTokenType } = require("./TypeWatcher")
const { WithClickable } = require('components/Clickable')
const Component = require('component')

const WithReplacer = ({ type, start, end } = {}) => {

  return f => Component(f)
    .map(WithClickable())
    .map(WithTypeWatcher({
      type,
      to: 'isTypeActive$'
    }))
    .map(WithSetReducer({
      key: 'active',
      from: 'isTypeActive$'
    }))
    .listener({
      name: 'EditorReplacer',
      from: (sinks, { codemirror$ = $.empty() }) => codemirror$.map(editor => {
        return sinks.click$
          .map(event => {

            let startPoint = editor.getCursor("start")
            let endPoint = editor.getCursor("end")
            let text = editor.getSelection()
            const token = editor.getTokenAt(startPoint)

            let word
            if (text.length < 1) { 
              // Fallback to current word when no selection

              word = editor.findWordAt(editor.getCursor())
              text = editor.getRange(word.anchor, word.head)
              startPoint = word.anchor
              endPoint = word.head
            }

            const trimmedText = text.replace(/\s/g, '')

            if (trimmedText.length < 1 || trimmedText === end || trimmedText === start) return

            const line = editor.getLine(startPoint.line)

            if (hasTokenType(token, type)) {

              const before = line.slice(0, startPoint.ch - start.length)
              const after = line.slice(endPoint.ch + end.length)

              editor.replaceRange(
                before + text + after,
                { line: startPoint.line, ch: 0 },
                { line: startPoint.line, ch: line.length }
              )

              endPoint.ch = startPoint.ch = (startPoint.ch - start.length) + text.length

            } else {

              editor.replaceRange(
                start + text + end,
                startPoint,
                endPoint
              )

              startPoint.ch += start.length
              endPoint.ch = startPoint.ch + text.length
            }
            editor.setSelection(startPoint, endPoint);
            editor.focus()
          })
      }).flatten()
    })
}

module.exports = {
  default: WithReplacer,
  WithReplacer,
}