const test = require('ava')
const { Stream: $ } = require('xstream')
const { WithClickable } = require('./Clickable')
const jsc = require("jsverify");
const equals = require("ramda/src/equals");
const when = require("ramda/src/when");
const always = require("ramda/src/always");
const { diagramArbitrary: diagramArb } = require('cyclejs-test-helpers')
const { pipe } = require('monocycle/utilities/pipe')
const { renderVnode } = require('../utilities/renderVnode')
const { withTimeMacro } = require('../utilities/withTimeMacro')
const { WithFactoryMacro } = require('../utilities/WithFactoryMacro')

const testsOptions = { tests: 1 }

const ClickableMacro = pipe(
  withTimeMacro,
  WithFactoryMacro(WithClickable)
)

test('Clickable', ClickableMacro((t, Time, withClickable) => {

  const property = jsc.forall(diagramArb, diagramArb, (a, b) => {

    const up$ = Time.diagram(a)
    const down$ = Time.diagram(b)

    const clickable = withClickable()

    const sinks = clickable({
      DOM: {
        events: pipe(
          when(equals('mouseup'), always(up$)),
          when(equals('mousedown'), always(down$)),
        )
      }
    })

    Time.assertEqual(
      sinks.DOM.map(renderVnode),
      $.merge(
        down$.mapTo(' class="click"'),
        up$.startWith(true).mapTo(''),
      ).map(classes => `<div${classes}></div>`),
      t.is.bind(t)
    )

    return true
  })

  jsc.assert(property, testsOptions)
}))