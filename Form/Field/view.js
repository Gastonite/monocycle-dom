const { div, input, h, span } = require('@cycle/dom')
const defaultStyle = require('./style')
const { classes } = require('typestyle')
const { mergeClasses } = require('utilities/style')


const DefaultInputView = ({
  type,
  viewValue,
  readOnly,
  required,
  style
} = {}) => 
input({
  attrs: { type },
  props: {
    value: viewValue,
    readOnly,
    required,
    className: style.input
  },
  hook: {}
  // hook: isDirty ? void 0 : {
  //   update: (	oldVnode, vnode) => vnode.elm.value = viewValue || ''
  // }
})


const makeFieldView = ({
  InputView = DefaultInputView,
  style: styleOverride = {}
} = {}) => (state = {}) => {

  const {
    type,
    name,
    label,
    isValid,
    isFocused,
    readOnly,
    required,
    message,
    value,
    viewValue
  } = state

  const style = mergeClasses(defaultStyle, styleOverride)
  const isDirty = viewValue !== value
  const isActive = Boolean(isFocused || viewValue || isDirty)
  const opacity = Number(isActive).toString() + ' !important'

  console.error('FieldView()', { isDirty, isValid, value, viewValue, state, InputView, isActive })

  return div({
    // attrs: {
    //   tabindex: '0'
    // },
    props: {
      className: classes(
        style.field,
        isActive && 'active',
        !isValid && isDirty && 'error',
        isValid && isDirty && 'success',
        isFocused && 'focus',
      )
    }
  }, [
    
      InputView({
        ...state,
        style,
      }),

      span({
        props: { className: style.separator },
      }),

      h('label', {
        props: {
          className: classes(
            style.label,
            // isActive && style.labelFocused
          )
        },
      }, label || name),


      !isDirty ? '' : div({
        props: { className: style.message },
        style: {
          opacity
        }
      }, message),
    ])
}

module.exports = {
  default: makeFieldView,
  makeFieldView,
  DefaultInputView
}
