const { Component } = require('monocycle')
const { pipe } = require('monocycle/utilities/pipe')
const { coerce } = require('monocycle/utilities/coerce')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const when = require('ramda/src/when')
const tap = require('ramda/src/tap')
const either = require('ramda/src/either')
const always = require('ramda/src/always')
const isEmpty = require('ramda/src/isEmpty')
const { WithView } = require('../View')
const { WithClickable } = require('../Clickable')
const isFalsy = require('ramda-adjunct/lib/isFalsy').default

const WithButton = pipe(
  tap(() => {

    Component.set('View', WithView)
    Component.set('Clickable', WithClickable)
    Component.set('DumbButton', 'View', {
      sel: 'button'
    })
  }),
  coerce,
  over(lensProp('has'),
    when(either(isFalsy, isEmpty), always('Button'))
  ),
  buttonOptions => pipe(
    Component.get('Clickable', {
      upEvent: { name: 'animationend' },
    }),
    Component.get('DumbButton', buttonOptions)
  )
)

module.exports = {
  default: WithButton,
  WithButton
}