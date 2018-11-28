const $ = require('xstream').default
const { pipe } = require('monocycle/utilities/pipe')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default
const unless = require('ramda/src/unless')
const both = require('ramda/src/both')
const map = require('ramda/src/map')
const keys = require('ramda/src/keys')
const endsWith = require('ramda/src/endsWith')
const isEmpty = require('ramda/src/isEmpty')
const always = require('ramda/src/always')
const { coerce } = require('monocycle/utilities/coerce')
const { Factory } = require('monocycle/utilities/factory')
const lensProp = require('ramda/src/lensProp')
const slice = require('ramda/src/slice')
const over = require('ramda/src/over')
const test = require('ramda/src/test')
const propEq = require('ramda/src/propEq')
const dissoc = require('ramda/src/dissoc')
const when = require('ramda/src/when')
const propSatisfies = require('ramda/src/propSatisfies')
const concat = require('ramda/src/concat')
const { h } = require('snabbdom/h')
const mergeDeepRight = require('ramda/src/mergeDeepRight')
const { WithListener } = require('monocycle/components/Listener')
const { WithDynamic } = require('monocycle/components/Dynamic')
const { makeComponent } = require('monocycle')
const { WithSymbols } = require('monocycle-abstract/symbols')
const isFunctor = require('@f/is-functor')
const log = require('monocycle/utilities/log').Log('View')
const { makeDefaultView, ViewCombiner, mergeViewOptions } = require('../')
// const mergeSelectors = require('snabbdom-merge/merge-selectors')

// mergeSelectors('')

// const WithDynamicView = pipe(
//   over(lensProp('from'), unless(isFunction, always(void 0))),
//   ({ from, ...options }) => {

//     return WithDynamic(pipe(
//       from,
//       unless(both(
//         isFunctor,
//         propSatisfies(isFunction, 'subscribe'),
//       ), $.of),
//       map(pipe(
//         coerce,
//         when(propEq('has', []), dissoc('has')),
//         mergeDeepRight(options),
//         makeView
//       ))
//     ))
//   }
// )

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

const render = ({ has, sel, children, ...options }) => {

  console.error('render()', { sel, has, children, options })

  return h(sel, options, children || has)
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
  parseViewOptions,
  over(lensProp('from'), unless(isFunction, always(void 0))),
  ({ Component, from, sel, has, ...options }) => {

    if (!from)
      return component => Component([
        component,
        Component({
          // View: h.bind(void 0, sel, options),
          View: children => render({ children, sel, ...options }),
          has
        })
      ])

    return WithListener({
      Component,
      has: [
        {
          from: (sinks, sources) => {

            return (from(sinks, sources) || $.empty())

              .map(value => {

                return pipe(
                  coerce,
                  mergeViewOptions({
                    ...options,
                    sel,
                  }),
                  parseViewOptions,
                  render
                )(value)
              })
              .map(log.partial('View view:'))
          },
          to: 'DOM'
        }
      ]
    })
  }
)


module.exports = {
  WithView,
  // WithDynamicView,
  default: WithView,
}
