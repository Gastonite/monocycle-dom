const { makeFieldView } = require( 'components/Field/view')
const { div, textarea } = require( '@cycle/dom')
const { px } = require( 'csx/lib/internal/units')

const syncHeightHandler = element =>  {
  element.style.height = 'auto';
  element.style.height = px(element.scrollHeight)
}


const EditorTextareaView = ({
  attrs: { type, ...attrs } = {},
  props: { className, value = '', ...props } = {},
  hook = {},
  ...options
} = {}) => {

  console.error('EditorTextareaView()', {
    options,
    props,
    attrs
  })

  // return textarea()
  return div([
    'pouet',
    textarea({
      ...options,
      attrs,
      props: {
        ...props,
        value,
        // className: classes(className, style({
        //   resize: 'none',
        //   overflow: 'hidden'
        // }))
      },
      hook: {
        ...hook,
        // update: noop,
      }
    })
  ])
}

module.exports = makeFieldView({
  InputView: EditorTextareaView
})
