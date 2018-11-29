const { Stream: $ } = require('xstream')
const { makeComponent } = require('monocycle')
const { pipe } = require('monocycle/utilities/pipe')
const { coerce } = require('monocycle/utilities/coerce')
const { WithListener } = require('monocycle/components/Listener')
const { WithView } = require('../View')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const when = require('ramda/src/when')
const either = require('ramda/src/either')
const always = require('ramda/src/always')
const objOf = require('ramda/src/objOf')
const unless = require('ramda/src/unless')
const isEmpty = require('ramda/src/isEmpty')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const isFalsy = require('ramda-adjunct/lib/isFalsy').default
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default
const isFunction = require('ramda-adjunct/lib/isFunction').default
// const log = require('monocycle/utilities/log').Log('Clickable')

const WithClickable = pipe(
  coerce,
  over(lensProp('Component'), pipe(
    unless(isFunction, makeComponent.bind(void 0, void 0))
  )),
  over(lensProp('upEvent'), pipe(
    ensurePlainObj,
    over(lensProp('name'), unless(
      isNonEmptyString,
      always('mouseup')
    )),
  )),
  over(lensProp('downEvent'), pipe(
    ensurePlainObj,
    over(lensProp('name'), unless(
      isNonEmptyString,
      always('mousedown')
    )),
  )),
  over(lensProp('has'),
    when(either(isFalsy, isEmpty), always('Clickable'))
  ),
  ({ Component, downEvent, upEvent, ...options }) => {

    return pipe(
      WithListener([
        {
          from: (sinks, sources) => $.merge(
            sources.DOM.events(downEvent.name, downEvent.options).mapTo(true),
            sources.DOM.events(upEvent.name, upEvent.options).mapTo(false),
          ),
          to: 'click$'
        }
      ]),
      WithView({
        ...options,
        Component,
        from: (sinks, sources) => sinks.click$
          .startWith(false)
          .map(pipe(
            objOf('click'),
            objOf('class'),
          ))
      })
    )
  },
)
module.exports = {
  default: WithClickable,
  WithClickable
}