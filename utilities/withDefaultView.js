const { Stream: $ } = require('xstream')
const over = require('ramda/src/over')
const pipe = require('ramda/src/pipe')
const always = require('ramda/src/always')
const objOf = require('ramda/src/objOf')
const unless = require('ramda/src/unless')
const lensProp = require('ramda/src/lensProp')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const isFunction = require('ramda-adjunct/lib/isFunction').default

const makeDefaultView = pipe(
  $.of,
  objOf('DOM'),
  always
)

const withDefaultView = makeComponent => pipe(
  ensurePlainObj,
  over(lensProp('makeDefault'), unless(isFunction, always(makeDefaultView))),
  makeComponent
)

module.exports = {
  default: withDefaultView,
  withDefaultView,
  makeDefaultView
}