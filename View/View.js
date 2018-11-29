const $ = require('xstream').default
const { pipe } = require('monocycle/utilities/pipe')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default
const unless = require('ramda/src/unless')
const prop = require('ramda/src/prop')
const endsWith = require('ramda/src/endsWith')
const isEmpty = require('ramda/src/isEmpty')
const ifElse = require('ramda/src/ifElse')
const always = require('ramda/src/always')
const { coerce } = require('monocycle/utilities/coerce')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const lensProp = require('ramda/src/lensProp')
const slice = require('ramda/src/slice')
const over = require('ramda/src/over')
const test = require('ramda/src/test')
const when = require('ramda/src/when')
const concat = require('ramda/src/concat')
const { h } = require('snabbdom/h')
const { WithListener } = require('monocycle/components/Listener')
const { makeComponent } = require('monocycle')
const { WithSymbols } = require('monocycle-abstract/symbols')
const log = require('monocycle/utilities/log').Log('View')
const { makeDefaultView, ViewCombiner, mergeViewOptions } = require('../')
const toHtml = require('snabbdom-to-html')

const parseViewOptions = pipe(
  over(lensProp('sel'), pipe(
    unless(isNonEmptyString, always('.')),
    when(test(/^[.#]+/), concat('div')),
    when(endsWith('.'), slice(0, -1)),
  )),
  over(lensProp('has'), pipe(
    when(isEmpty, always('')),
  )),
)

const render = ({ sel, children, ...options }) => {

  const vnode = h(sel, options, children)

  log('render()', {
    // sel,
    // has,
    // children,
    // options,
    html: toHtml(vnode)
  })
  return vnode
}

const WithDumbView = pipe(
  ensurePlainObj,
  over(lensProp('has'), pipe(
    when(isEmpty, always('')),
  )),
  ({ Component, sel, has, options }) => {

    // log('WithDumbView()', { sel, has })
    // if ()
    return component => Component([
      component,
      Component({
        // View: h.bind(void 0, sel, options),
        View: children => render({ children, sel, ...options }),
        has
      })
    ])
  }
)

const WithReactiveView = ({ Component, from, sel, options }) => {

  // log('WithReactiveView()', {
  //   // sel,
  //   options
  // })

  options = { ...options, sel }

  return WithListener({
    Component,
    has: [
      {
        from: (sinks, sources) => {

          return (from(sinks, sources) || $.empty())
            .map(pipe(
              coerce,
              mergeViewOptions(options),
              parseViewOptions,
              render
            ))
        },
        to: 'DOM'
      }
    ]
  })
}

const WithView = pipe(
  coerce,
  over(lensProp('Component'), pipe(
    unless(isFunction, () => pipe(
      WithSymbols({
        mergeOptions: mergeViewOptions
      }),
    )(makeComponent({
      makeDefault: makeDefaultView,
      Combiners: options => ({
        DOM: ViewCombiner(options)
      })
    })))
  )),
  over(lensProp('sel'), pipe(
    unless(isNonEmptyString, always('.')),
    when(test(/^[.#]+/), concat('div')),
    when(endsWith('.'), slice(0, -1)),
  )),
  over(lensProp('from'), unless(isFunction, always(void 0))),
  ({ Component, from, sel, has, ...options }) => ({
    Component, from, sel, has, options
  }),

  ifElse(prop('from'),
    WithReactiveView,
    WithDumbView
  ),
)


module.exports = {
  WithView,
  // WithDynamicView,
  default: WithView,
}
