const { Stream: $ } = require('xstream')
const { WithClickable } = require('components/Clickable')
const Component = require('component')

const WithInserter = ({
  type,
  delimiter,
  pattern
} = {}) => {

  return f => Component(f)
    .map(WithClickable())
    .listener({
      name: 'EditorInserter',
      from: (sinks, { codemirror$ = $.of({}) }) =>
        sinks.click$
          .mapTo(codemirror$)
          .flatten()
          .map(editor => {

            editor.replaceSelection(delimiter, 'end')
            editor.focus()
          })
          .replaceError(err => console.error(err) || Stream.never())
    })
}

module.exports = {
  default: WithInserter,
  WithInserter,
}