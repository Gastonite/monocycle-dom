const test = require('ava')
const { mockDOMSource } = require('@cycle/dom')
const { Stream: $ } = require('xstream')
const { WithButton } = require('./Button')
const jsc = require("jsverify")
const keys = require("ramda/src/keys")
const always = require("ramda/src/always")
const { diagramArbitrary: diagramArb, wthTime } = require('cyclejs-test-helpers')
const { pipe } = require('monocycle/utilities/pipe')
const { renderVnode } = require('../utilities/renderVnode')
const isEmpty = require("ramda/src/isEmpty")
const ifElse = require("ramda/src/ifElse")
const { withTimeMacro } = require('monocycle/utilities/withTimeMacro')
const { WithFactoryMacro } = require('monocycle/utilities/WithFactoryMacro')

const testsOptions = { tests: 1 }

const withButtonMacro = pipe(
  withTimeMacro,
  WithFactoryMacro(WithButton)
)

test(`with no arguments`, withButtonMacro((t, Time, withButton, ...args) => {

  const property = jsc.forall(diagramArb, diagramArb, (a, b) => {

    const up$ = Time.diagram(a);
    const down$ = Time.diagram(b);

    const button = withButton.apply(void 0, args)
    const sinks = button({
      DOM: mockDOMSource({
        'mousedown': down$,
        'mouseup': up$,
      })
    })

    t.deepEqual(keys(sinks), ['click$', 'DOM'])

    Time.assertEqual(
      sinks.DOM.map(renderVnode),
      $.merge(
        down$.mapTo(['click']),
        up$.startWith(false).mapTo([]),
      )
        .map(pipe(
          ifElse(isEmpty,
            always(''),
            classes => ` class="${classes.join(' ')}"`
          ),
          classes => `<button${classes}></button>`)
        ),
      t.is.bind(t)
    )

    return true
  })

  jsc.assert(property, testsOptions)
}), [])
