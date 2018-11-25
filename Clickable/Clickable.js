const { Stream: $ } = require('xstream')
const { Component } = require('monocycle')
const pipe = require('ramda/src/pipe')
const { coerce } = require('monocycle/utilities/coerce')
const { WithListener } = require('monocycle/components/Listener')
const { WithView } = require('../View')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const when = require('ramda/src/when')
const either = require('ramda/src/either')
const always = require('ramda/src/always')
const unless = require('ramda/src/unless')
const isEmpty = require('ramda/src/isEmpty')
const log = require('monocycle/utilities/log').Log('Clickable')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const isFalsy = require('ramda-adjunct/lib/isFalsy').default
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default


const WithClickable = pipe(
  coerce,
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
  ({ downEvent, upEvent, ...options }) => ({
    ...options,
    from: (component, sources) => {

      console.log('from')
      return $.merge(
        sources.DOM.events(downEvent.name, downEvent.options).mapTo(true),
        sources.DOM.events(upEvent.name, upEvent.options).mapTo(false),
      ).startWith()
        .map(click => ({
          class: {
            click
          },
        }))
    },
  }),
  WithView
)
module.exports = {
  default: WithClickable,
  WithClickable
}