const { Stream: $ } = require('xstream')
const { h } = require('snabbdom/h')
const pipe = require('ramda/src/pipe')
const lensProp = require('ramda/src/lensProp')
const over = require('ramda/src/over')
const isEmpty = require('ramda/src/isEmpty')
const concat = require('ramda/src/concat')
const isString = require('ramda-adjunct/lib/isString').default
const isFunction = require('ramda-adjunct/lib/isFunction').default
const startsWith = require('ramda/src/startsWith')
const when = require('ramda/src/when')
const unless = require('ramda/src/unless')
const always = require('ramda/src/always')
const mergeDeepRight = require('ramda/src/mergeDeepRight')
const { WithListener } = require('monocycle/listener')
const { makeComponent } = require('monocycle')
const { coerce } = require('monocycle/utilities/coerce')
const log = require('monocycle/utilities/log').Log('View')
const noop = always(void 0)
const { EmptyObject } = require('monocycle/utilities/empty')

const WithViewOld = (options = {}) => {

  console.log('WithView()', options)

  const {
    sel = 'div',
    has = `View`,
    from,
    View: _View = h,
    Component,
    ...snabbdomOptions
  } = options = pipe(
    when(isString, string => s => ({ DOM: $.of(string) })),
    coerce,
    log.partial('View1'),
    // over(lensProp('from'), unless(isFunction, always($.of.bind(void 0, void 0)))),
    over(lensProp('from'), unless(isFunction, always(void 0))),
    over(lensProp('Component'), unless(isFunction, () => makeComponent())),
    // over(lensProp('from'), unless(isFunction,
    //   AfterFromString({
    //     dependencies: {
    //       $
    //     }
    //   }),
    //   unless(isFunction, always(void 0)),
    // )),
    log.partial('View2'),

    // over(lensProp('from'), pipe(
    //   when(isString, prop),
    //   unless(isFunction, always(void 0)),
    // )),
    over(lensProp('sel'), pipe(
      unless(isString, always('div')),
      when(startsWith('.'), concat('div')),
    )),
    over(lensProp('has'), pipe(
      when(isEmpty, always('View')),
    )),
    log.partial('View3'),

  )(options)

  log('WithView()', {
    sel,
    has,
    from,
    View: _View,
  })

  const View = _View.bind(void 0, sel)

  if (!from)
    // return Cycle.get('')

    return component => Component({
      View: View.bind(void 0, snabbdomOptions),
      has,
    }, 'View')

  // return component => Cycle([
  //   component,
  //   Cycle({
  //     View: View.bind(void 0, snabbdomOptions),
  //     has,
  //   }, 'View')
  // ], 'DumbView')

  return WithListener({
    from: (sinks, sources) => {

      return (from(sinks, sources) || $.empty())
        .map(value => pipe(
          Component.coerce,
          mergeDeepRight(snabbdomOptions),
          ({ has, ...options }) => View(options, has),
        )(value))
        .map(log.partial('View view:'))
    },
    to: 'DOM'
  })
}

const WithView = pipe(
  coerce,
  log.partial(1),
  ({ has }) => {

    const withView = pipe(
      log.partial(2),
      unless(isFunction, always(EmptyObject)),
      component => {

        log(3)

        const View = sources => {

          const sinks = component(sources)

          log(4, sinks)

          return sinks
        }

        return View
      }
    )

    return withView
  }
)



module.exports = {
  WithView,
  default: WithView,
}
