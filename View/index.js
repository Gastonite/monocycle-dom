const { Stream: $ } = require('xstream')
const { h } = require('snabbdom/h')
const pipe = require('ramda/src/pipe')
const path = require('ramda/src/path')
const lensProp = require('ramda/src/lensProp')
const over = require('ramda/src/over')
const applyTo = require('ramda/src/applyTo')
const concat = require('ramda/src/concat')
const isString = require('lodash/isString')
const isFunction = require('lodash/isFunction')
const startsWith = require('ramda/src/startsWith')
const objOf = require('ramda/src/objOf')
const map = require('ramda/src/map')
const when = require('ramda/src/when')
const unless = require('ramda/src/unless')
const prop = require('ramda/src/prop')
const always = require('ramda/src/always')
const mergeDeepRight = require('ramda/src/mergeDeepRight')
const { mergeSinks, extractSinks } = require('cyclejs-utils')
const { AfterFromString } = require('monocycle/operators/listener')


const WithView = (options = {}, Cycle) => {


  const {
    sel = 'div',
    has = `I'm an empty View`,
    from,
    View: _View = h,
    ...snabbdomOptions
  } = options = pipe(
    Cycle.coerce,

    over(lensProp('from'), unless(isFunction,
      AfterFromString({
        dependencies: {
          $
        }
      }),
      unless(isFunction, always(void 0)),

    )),
    // over(lensProp('from'), pipe(
    //   when(isString, prop),
    //   unless(isFunction, always(void 0)),
    // )),
    over(lensProp('sel'), pipe(
      unless(isString, always('div')),
      when(startsWith('.'), concat('div')),
    )),
  )(options)

  Cycle.log('WithView()', {
    sel,
    from,
    View: _View,
  })

  const View = _View.bind(void 0, sel)

  if (!from)
    return component => Cycle([component, Cycle({
      View: View.bind(void 0, snabbdomOptions),
      has,
    }, 'View')])

  const render = ({ has, ...options }) => View(options, has)

  return pipe(
    WithView(snabbdomOptions, Cycle),

    component => {


      const Tmp = sources => {

        const sinks = component(sources)
        const tmp = from(sinks, sources)

        const component$ = tmp
          .map(pipe(

            unless(isFunction, pipe(
              mergeDeepRight(snabbdomOptions),
              render,
              $.of,
              objOf('DOM'),
              always,
            ))
          ))

        const otherSinks = extractSinks(
          component$.map(applyTo(sources)),
          Object.keys(sources)
        )

        sinks.DOM.addListener(x => x)

        return mergeSinks(
          [sinks, otherSinks],
          Object.keys(sources)
        )
      }

      return Cycle(Tmp)
    },
  )
}


const ViewHelper = (sel) => {
  return (options = {}) => {

    const {
      sel: _sel = '',
      has,
    } = options = Cycle.coerce(options)

    return WithView({
      ...options,
      has,
      sel: sel + _sel
    })
  }
}

module.exports = {
  WithView,
  default: WithView,
  ViewHelper
}
