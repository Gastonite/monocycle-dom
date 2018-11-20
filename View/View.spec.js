const { WithView } = require('./View')
const { makeComponent: _makeComponent } = require('monocycle/component')
const pipe = require('ramda/src/pipe')
const { Stream: $ } = require('xstream')
const { assertForall } = require('jsverify')
const { diagramArbitrary, withTime } = require('cyclejs-test-helpers')
const assert = require('assert')
const equals = require('ramda/src/equals')
const identity = require('ramda/src/identity')
const keys = require('ramda/src/keys')
const SnabbdomToHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken
const { div } = require('@cycle/dom')
const { withViewCombiner } = require('../utilities/withViewCombiner')
const { withDefaultView } = require('../utilities/withDefaultView')
// const htmlLooksLike = require('html-looks-like');

suite('WithView', () => {

  const makeComponent = pipe(
    withDefaultView,
    withViewCombiner
  )(_makeComponent)

  const Component = makeComponent()


  test('creates a view', () =>
    assertForall(diagramArbitrary, () =>
      withTime(Time => {

        const component = WithView({
          Component,
          sel: '#zo.bu',
          View: div,
          has: WithView({
            Component,
            sel: '.ga',
            has: 'meu'
          })()
        })()

        const sinks = component()

        assert(equals(keys(sinks), ['DOM']), 'Unexpected sinks')

        Time.assertEqual(
          sinks.DOM.map(SnabbdomToHtml),
          $.of('<div id="zo" class="bu"><div class="ga">meu</div></div>')
        )

      })
    )
  )

  suite('from previous component', () => {

    test('creates a View component', () => {
      assertForall(diagramArbitrary, (a) =>
        withTime(Time => {

          const diagramA = Time.diagram(a)

          const previousComponent = sources => ({
            DOM: $.of(div('.zo', {
              style: {
                color: 'black'
              }
            }, 'Hello')),
            otherSink: diagramA
          })

          const withView = WithView({
            Component,
            has: 'Hi world!',
            class: {
              another: true
            }
          })

          const component = withView(previousComponent)
          const sinks = component()

          assert(equals(keys(sinks), ['otherSink', 'DOM']), 'Unexpected sinks')

          Time.assertEqual(
            sinks.DOM.map(SnabbdomToHtml),
            $.of('<div class="zo another" style="color: black">Hi world!</div>'),
          )
        })
      )
    })

    test('creates a DynamicView component', () => {
      assertForall(diagramArbitrary, (a) =>
        withTime(Time => {

          const diagramA = Time.diagram(a)

          const previousComponent = sources => ({ DOM: $.of('world') })

          const withView = WithView({
            Component,
            class: {
              ga: 0,
              zo: 1
            },
            from: (component, sources) => ({
              class: {
                bu: 1,
                ga: 1,
              },
              has: [
                'Hello ',
                component,
                ' !'
              ]
            })
          })

          const component = WithView({ // TODO from must always return a functor
            Component,
            class: {
              ga: 0,
              zo: 1
            },
            from: (component, sources) => ({
              class: {
                bu: 1,
                ga: 1,
              },
              has: [
                'Hello ',
                component,
                ' !'
              ]
            })
          })(sources => ({ DOM: $.of('world') }))

          const sinks = component({ DOM: 42 })

          assert.deepStrictEqual(
            keys(sinks),
            ['DOM']
          )

          // sinks.DOM
          //   .map(SnabbdomToHtml)
          //   .debug('ici')
          //   .map(actual => {

          //     actual
          //     assert.strictEqual(
          //       actual,
          //       '<div class="bu zo">Hello world !</div>'
          //     )

          //     done()

          //     return actual
          //   })
          //   .addListener(identity)

          Time.assertEqual(
            sinks.DOM.map(SnabbdomToHtml),
            $.of('<div class="bu zo">Hello world !</div>'),
          )
        })
      )
    })
  })

})