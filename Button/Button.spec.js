const test = require('ava')
const { Stream: $ } = require('xstream')
const { WithButton } = require('./Button')
const jsc = require("jsverify");
const equals = require("ramda/src/equals");
const when = require("ramda/src/when");
const keys = require("ramda/src/keys");
const always = require("ramda/src/always");
const { diagramArbitrary, wthTime } = require('cyclejs-test-helpers')
const { pipe } = require('monocycle/utilities/pipe')
const log = require('monocycle/utilities/log').Log('ButtonSpec')
const { withTime } = require('../utilities/withTime')
const { renderVnode } = require('../utilities/renderVnode')
const { div } = require('@cycle/dom')
const { makeView, WithView } = require('../View')
const { withDOM, mergeOptions } = require('..')
const { WithSymbols } = require('monocycle-abstract/symbols')
const { Component } = require('monocycle/component')
const isString = require('ramda-adjunct/lib/isString').default
const ensureArray = require('ramda-adjunct/lib/ensureArray').default

pipe(
  withDOM,
  WithSymbols({
    mergeOptions
  })
)(Component)

Component.set('View', WithView, { Component })
Component.set('DumbButton', 'View', {
  sel: 'button.MyButton'
  // Component
})

const buttonMacro = withTime((Time, t, getSpec) => {

  const { input = [], Expected, before = [] } = getSpec()

  const property = jsc.forall(diagramArbitrary, diagramArbitrary, (a, b) => {

    const up$ = Time.diagram(a);
    const down$ = Time.diagram(b);

    const withButton = WithButton.apply(void 0, ensureArray(input))
    const button = withButton.apply(void 0, ensureArray(before))

    const sinks = button({
      DOM: {
        events: pipe(
          when(equals('mousedown'), always(down$)),
          when(equals('animationend'), always(up$)),
        )
      }
    })

    Time.assertEqual(
      sinks.DOM.map(renderVnode),
      $.merge(
        down$.mapTo(' click'),
        up$.startWith(false).mapTo(''),
      ).map(Expected),
      t.is
    )

    return true
  })

  jsc.assert(property, { tests: 100 })
})

buttonMacro.title = (...args) => {
  args
  return `Create a button` + (isString(args[0]) ? ` (${args[0]})` : '')
}

test(buttonMacro, () => ({
  Expected: classes => `<button class="MyButton${classes}"></button>`,
}))

test("with view options", buttonMacro, () => ({
  input: {
    sel: '.other',
    has: 'zo'
  },
  Expected: classes => `<button class="MyButton other${classes}">zo</button>`,
}))

