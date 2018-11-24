const $ = require('xstream').default
const pipe = require('ramda/src/pipe')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default
const unless = require('ramda/src/unless')
const both = require('ramda/src/both')
const map = require('ramda/src/map')
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
const { WithDynamic } = require('monocycle/components/Dynamic')
const { makeComponent } = require('monocycle/component')
const isFunctor = require('@f/is-functor')
const log = require('monocycle/utilities/log').Log('View')

const makeView = pipe(
  coerce,
  log.partial('makeView()'),
  over(lensProp('sel'), pipe(
    unless(isNonEmptyString, always('.')),
    when(test(/^[.#]+/), concat('div')),
    when(endsWith('.'), slice(0, -1)),
  )),
  over(lensProp('Component'), pipe(
    unless(isFunction, () => makeComponent())
  )),
  over(lensProp('has'), pipe(
    when(isEmpty, always(''))
  )),
  // options => {

  //   return over(lensProp('has'), pipe(
  //     when(isEmpty, always(options.Component.Empty)),
  //     // when(isEmpty, always(s => ({ DOM: $.of('') }))),
  //   ))(options)
  // },

  ({ has, sel, Component, ...options }) => {


    console.log('View()', sel)
    return Component({
      View: h.bind(void 0, sel, options),
      has
    })
  }
)

const WithView = pipe(
  over(lensProp('from'), unless(isFunction, always(void 0))),
  over(lensProp('Component'), pipe(
    unless(isFunction, () => makeComponent())
  )),
  ({ from, ...options }) => {

    const { Component } = options

    if (from)
      return WithDynamic(pipe(
        from,
        unless(both(
          isFunctor,
          propSatisfies(isFunction, 'subscribe'),
        ), $.of),
        map(pipe(
          coerce,
          when(propEq('has', []), dissoc('has')),
          mergeDeepRight(options),
          makeView
        ))
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
