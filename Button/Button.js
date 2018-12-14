const { makeComponent } = require('monocycle')
const { pipe } = require('monocycle/utilities/pipe')
const { coerce } = require('monocycle/utilities/coerce')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const when = require('ramda/src/when')
const defaultTo = require('ramda/src/defaultTo')
const unless = require('ramda/src/unless')
const tap = require('ramda/src/tap')
const { DefaultView, ViewCombiner, mergeViewOptions } = require('../')
const { WithSymbols } = require('monocycle-abstract')
const either = require('ramda/src/either')
const always = require('ramda/src/always')
const isEmpty = require('ramda/src/isEmpty')
const { WithView } = require('../View')
const { WithClickable } = require('../Clickable')
const isFalsy = require('ramda-adjunct/lib/isFalsy').default
const isFunction = require('ramda-adjunct/lib/isFunction').default

const WithButton = pipe(
  coerce,
  over(lensProp('Component'), pipe(
    unless(isFunction, () => {

      // pipe(
      //   // withDOM,
      //   // WithSymbols({
      //   //   mergeOptions
      //   // })
      // )
      return pipe(
        WithSymbols({
          mergeOptions: mergeViewOptions
        }),
      )(makeComponent({
        Default: DefaultView,
        Combiners: options => ({
          DOM: ViewCombiner(options)
        })
      }))
    })
  )),
  tap(({ Component }) => {

    Component.set('View', WithView)
    Component.set('Clickable', WithClickable)
    Component.set('Button', WithButton)
    Component.set('DumbButton', 'View', {
      sel: 'button'
    })

  }),
  over(lensProp('has'),
    when(either(isFalsy, isEmpty), always(''))
  ),

  ({ Component, upEvent, downEvent, ...buttonOptions }) => {
    // const  = x

    // return c => {


    //   const yo = WithView('yo')()
    //   const ga = WithView('yo')()

    //   return sources => {

    //     const sinks = ga(sources)
    //     sinks
    //     yo
    //     return {
    //       ...sinks
    //     }
    //   }
    // }

    return component => Component([
      component,
      Component.get('Clickable').make({
        upEvent,
        downEvent,
      }),
      Component.get('DumbButton').make(buttonOptions)
    ])
  }
)

module.exports = {
  default: WithButton,
  WithButton
}
