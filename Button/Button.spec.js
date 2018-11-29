const test = require('ava')
const { mockDOMSource } = require('@cycle/dom')
const { Stream: $ } = require('xstream')
const { WithButton } = require('./Button')
const { WithClickable } = require('../Clickable')
const jsc = require("jsverify");
const equals = require("ramda/src/equals");
const when = require("ramda/src/when");
const keys = require("ramda/src/keys");
const always = require("ramda/src/always");
const { diagramArbitrary: diagramArb, wthTime } = require('cyclejs-test-helpers')
const { pipe } = require('monocycle/utilities/pipe')
const log = require('monocycle/utilities/log').Log('ButtonSpec')
const { withTime } = require('cyclejs-test-helpers')
const { renderVnode } = require('../utilities/renderVnode')
const { div } = require('@cycle/dom')
const { makeView, WithView } = require('../View')
const isEmpty = require("ramda/src/isEmpty")
const ifElse = require("ramda/src/ifElse")
const { withDOM, mergeViewOptions } = require('..')
const { WithSymbols } = require('monocycle-abstract/symbols')
const isString = require('ramda-adjunct/lib/isString').default
const ensureArray = require('ramda-adjunct/lib/ensureArray').default
const { withTimeMacro } = require('../utilities/withTimeMacro')
const { WithFactoryMacro } = require('../utilities/WithFactoryMacro')

const testsOptions = { tests: 1 }

const ButtonMacro = pipe(
  withTimeMacro,
  WithFactoryMacro(WithButton)
)

test(`with no arguments`, ButtonMacro((t, Time, withButton, ...args) => {

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
