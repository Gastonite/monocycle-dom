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
const lensProp = require('ramda/src/lensProp')
const over = require('ramda/src/over')
const when = require('ramda/src/when')
const startsWith = require('ramda/src/startsWith')
const concat = require('ramda/src/concat')
const { h } = require('snabbdom/h')
const mergeDeepRight = require('ramda/src/mergeDeepRight')
const { WithDynamic } = require('monocycle/components/Dynamic')


const makeView = pipe(
  coerce,
  over(lensProp('sel'), pipe(
    unless(isNonEmptyString, always('.')),
    when(startsWith('.'), concat('div')),
  )),
  over(lensProp('has'), pipe(
    when(isEmpty, always('')),
  )),
  ({ has, sel, Component, ...options }) => {
    log('options', options)
    return Component({
      View: h.bind(void 0, sel, options),
      has
    })
  }
)

const WithView = pipe(
  over(lensProp('from'), unless(isFunction, always(void 0))),
  // over(lensProp('Component'), unless(isFunction, (x) => {
  //   console.log('erf')

  //   return makeComponent()
  // })),
  ({ from, Component, ...options }) => {

    options = { ...options, Component }

    if (from)
      return WithDynamic(pipe(
        from,
        coerce,
        mergeDeepRight(options),
        makeView,
        $.of
      ))

    const View = makeView(options)

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
