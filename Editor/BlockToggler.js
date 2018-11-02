const { default: $ } = require('xstream')
const { WithClickable } = require('components/Clickable')
const { WithSetReducer } = require('./SetReducer')
const { WithTypeWatcher, hasTokenType } = require('./TypeWatcher')

const WithBlockToggler = ({ type, delimiter, patterns = {} }, Cycle) => {

  return f => Cycle(f)
    .map(WithClickable())
    .map(WithTypeWatcher({ type }))
    .map(WithSetReducer({ key: 'active', from: 'isTypeActive$' }))
    .listener({
      name: 'EditorBlockToggler',
      from: (sinks, { codemirror$ = $.empty() }) => codemirror$.map(editor => {
        return sinks.click$
          .debug('click')
          .map(event => {

            let startPoint = editor.getCursor("start")
            let endPoint = editor.getCursor("end")
            let text = editor.getSelection()
            const token = editor.getTokenAt(startPoint)

            if (text.length < 1) {
              // Fallback to current word when no selection

              const word = editor.findWordAt(editor.getCursor())
              text = editor.getRange(word.anchor, word.head)

              startPoint = word.anchor
              endPoint = word.head
            }

            if (text.replace(/\s/g, '').length < 1 || text === delimiter)
              return

            const line = editor.getLine(startPoint.line)

            if (hasTokenType(token, type)) {

              const before = line.slice(0, startPoint.ch).replace(patterns.start, "")
              const after = line.slice(endPoint.ch).replace(patterns.end, "")

              editor.replaceRange(
                before + text + after,
                { line: startPoint.line, ch: 0 },
                { line: startPoint.line, ch: line.length }
              )

              startPoint.ch -= delimiter.length

              if (startPoint !== endPoint)
                endPoint.ch -= delimiter.length

            } else {

              editor.replaceRange(
                delimiter + text + delimiter,
                startPoint,
                endPoint
              )

              startPoint.ch += delimiter.length
              endPoint.ch = startPoint.ch + text.length
            }

            editor.setSelection(startPoint, endPoint)
            editor.focus()

            return editor
          })
      }).flatten()
    })
}

module.exports = {
  default: WithBlockToggler,
  WithBlockToggler
}