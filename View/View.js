const { Stream: $ } = require('xstream')
const { pipe } = require('monocycle/utilities/pipe')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const { coerce, Coerce } = require('monocycle/utilities/coerce')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default
const unless = require('ramda/src/unless')
const prop = require('ramda/src/prop')
const endsWith = require('ramda/src/endsWith')
const isEmpty = require('ramda/src/isEmpty')
const ifElse = require('ramda/src/ifElse')
const always = require('ramda/src/always')
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
const { DefaultView, ViewCombiner, mergeViewOptions } = require('../')


const coerceChildren = Coerce('children')

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

const render = ({ sel, children, ...options }) => h(sel, options, children)

const WithDumbView = pipe(
  ensurePlainObj,
  over(lensProp('has'), pipe(
    when(isEmpty, always('')),
  )),
  ({ Component, sel, has, options }) => {

    return component => Component([
      component,
      Component({
        View: children => render({ children, sel, ...options }),
        has
      })
    ])
  }
)

const WithReactiveView = ({ Component, from, sel, options }) => {

  const setDefaultOptions = mergeViewOptions({ ...options, sel })

  return WithListener({
    Component,

    from: (sinks, sources) => {

      return (from(sinks, sources) || $.empty())
        // .debug(`ReactiveView(${sel}).from`)
        .map(pipe(
          coerceChildren,
          setDefaultOptions,
          parseViewOptions,
          render
        ))
    },
    to: 'DOM'

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
      Default: DefaultView,
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
  default: WithView,
}
