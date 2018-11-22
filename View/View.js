const $ = require('xstream').default
const pipe = require('ramda/src/pipe')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const noop = require('ramda-adjunct/lib/noop').default
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default
const unless = require('ramda/src/unless')
const map = require('ramda/src/map')
const isEmpty = require('ramda/src/isEmpty')
const always = require('ramda/src/always')
const { coerce } = require('monocycle/utilities/coerce')
// const { pipe } = require('monocycle/utilities/pipe')
const log = require('monocycle/utilities/log').Log('View')
const { WithListener } = require('monocycle/components/Listener')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const { EmptyObject } = require('monocycle/utilities/empty')
const { Factory } = require('monocycle/utilities/factory')
// const { pipe } = require('monocycle/utilities/pipe')
const lensProp = require('ramda/src/lensProp')
const over = require('ramda/src/over')
const test = require('ramda/src/test')
const defaultTo = require('ramda/src/defaultTo')
const when = require('ramda/src/when')
const startsWith = require('ramda/src/startsWith')
const keys = require('ramda/src/keys')
const concat = require('ramda/src/concat')
const { h } = require('snabbdom/h')
const mergeDeepRight = require('ramda/src/mergeDeepRight')
const { WithDynamic } = require('monocycle/components/Dynamic')

const makeView = pipe(
  // log.partial('makeView()'),
  coerce,
  over(lensProp('sel'), pipe(
    unless(isNonEmptyString, always('.')),
    when(test(/^[.#]+/), concat('div')),
    // log.partial('sel')
  )),

  // x => x/*?keys($)*/,
  over(lensProp('has'), pipe(
    when(isEmpty, always('')),
  )),
  ({ has, sel, Component, ...options }) => {
    // log('options', options)

    return Component({
      View: h.bind(void 0, sel, options),
      has
    })
  }
)

const WithView = pipe(
  // log.partial('WithView()'),

  over(lensProp('from'), unless(isFunction, always(void 0))),
  // over(lensProp('Component'), unless(isFunction, (x) => {
  //   console.log('erf')

  //   return makeComponent()
  // })),
  // x => x/*?Object.keys($)*/,
  ({ from, Component, ...options }) => {

    const defaultOptions = { ...options, Component }

    if (from)
      return WithDynamic(pipe(
        from,
        coerce,
        mergeDeepRight(defaultOptions),
        // x => {

        //   x.class//?
        //   return x//? Object.keys($)
        // },
        makeView,
        $.of
      ))

    const View = makeView(defaultOptions)

    return component => {

      return Component([
        component,
        View
      ])
    }
  }
)


module.exports = {
  WithView,
  makeView: Factory(WithView),
  default: WithView,
}
