const test = require('ava')
const { Stream: $ } = require('xstream')
const { WithClickable } = require('./Clickable')

const jsc = require("jsverify");
const equals = require("ramda/src/equals");
const when = require("ramda/src/when");
const keys = require("ramda/src/keys");
const always = require("ramda/src/always");
const { diagramArbitrary, wthTime } = require('cyclejs-test-helpers')
const { pipe } = require('monocycle/utilities/pipe')
const { withTime } = require('../utilities/withTime')
const { renderVnode } = require('../utilities/renderVnode')
const { div } = require('@cycle/dom')
const { makeView, WithView } = require('../View')
const { withDOM } = require('..')
const { Component } = require('monocycle/component')

withDOM(Component)

test("Clickable", withTime((Time, t) => {

  const property = jsc.forall(diagramArbitrary, diagramArbitrary, (a, b) => {

    const up$ = Time.diagram(a);
    const down$ = Time.diagram(b);

    const withClickable = WithClickable()
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
        up$.startWith(false).mapTo(''),
      ).map(classes => `<div${classes}></div>`),
      t.is
    )
    return true
  })

  jsc.assert(property, { tests: 100 })
}));