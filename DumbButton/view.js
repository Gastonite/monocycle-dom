const CSS = require('style')
// const Waves = require('snabbdom-material/lib/components/helpers/waves')
const { mergeClasses } = require('utilities/style')
const prop = require('ramda/src/prop')
const isFunction = require('lodash/isFunction')
const isObject = require('lodash/isObject')
const { button } = require("@cycle/dom")
const pipe = require('ramda/src/pipe')

const attachWavesHook = vnode => { } //Waves.attach(vnode.elm) || vnode

const makeButtonView = ({
  renderContent = prop('content'),
  defaultHooks = {
    insert: attachWavesHook,
  },
  baseStyle
} = {}) => {


  if (!isFunction(renderContent))
    throw new Error(`'renderContent' must be a function`)


  if (!isObject(defaultHooks))
    throw new Error(`'defaultHooks' must be an object`)


  baseStyle = mergeClasses(
    CSS,
    baseStyle
  )

  return ({
    flat,
    primary,
    secondary,
    disabled,
    raised,
    height,
    active,
    type,
    hook,
    content,
    style
  } = {}) => {

    console.error('ButtonView()', {
      content,
      height,
      primary,
      baseStyle,
      style,
      merged: mergeClasses(
        baseStyle,
        style
      )
    })

    style = mergeClasses(
      baseStyle,
      style
    )

    return button(`.${style.Button}`, {
      hook: !hook ? defaultHooks : {
        ...defaultHooks,
        insert: !isFunction(hook.insert)
          ? defaultHooks.insert
          : pipe(defaultHooks.insert, hook.insert)
      },
      class: {

        active,
        [style.raised]: raised,
        primary,
        secondary
      },
      props: {
        type,
        disabled,
        // className: CSS.button,
        // innerHTML: renderContent(state)
      }
    }, renderContent({
      flat,
      primary,
      secondary,
      disabled,
      raised,
      height,
      active,
      type,
      hook,
      content,
      style,
    }))
  }
}

module.exports = {
  default: makeButtonView(),
  makeButtonView,
  attachWavesHook
}