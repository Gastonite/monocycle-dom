const test = require('ava')
const { Stream: $ } = require('xstream')
const { WithView } = require('./View')
const jsc = require('jsverify')
const { diagramArbitrary, withTime } = require('cyclejs-test-helpers')
const pipe = require('ramda/src/pipe')
const keys = require('ramda/src/keys')
const { makeComponent: _makeComponent } = require('monocycle/component')
const { withViewCombiner } = require('../utilities/withViewCombiner')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const ensureArray = require('ramda-adjunct/lib/ensureArray').default
const { withDefaultView } = require('../utilities/withDefaultView')
const { div } = require('@cycle/dom')
const modules = require('snabbdom-to-html/modules')//? keys($)
const renderVnode = require('snabbdom-to-html/init')([
  modules.class,
  modules.props,
  modules.attributes,
  modules.style
])

test('foo', t => {
  t.pass();
})

test('bar', async t => {
  const bar = Promise.resolve('bar');
  t.is(await bar, 'bar');
})

test('dd', t => {
  t.plan(3);
  return $.of(1, 2, 3, 4, 1, 6)
    .filter(n => {
      // only even numbers
      return n % 2 === 0;
    })
    .map(() => t.pass());
});

const makeComponent = pipe(
  withDefaultView,
  withViewCombiner
)(_makeComponent)

const Component = makeComponent()

const viewMacro = (t, getSpec) => {


  const { input, expected, from } = getSpec()

  t.plan(2)

  const component = WithView(input).apply(void 0, isFunction(from) ? [from] : [])


  const sinks = component({ DOM: void 0 })

  t.deepEqual(keys(sinks), ['DOM'])

  return sinks.DOM
    .map(renderVnode)
    .map(actual => t.is(actual, expected))
}


test(`creates a view that 'has' a string`, viewMacro, () => ({
  input: {
    Component,
    sel: '#ga.zo',
    View: div,
    has: 'meu'
  },
  expected: '<div id="ga" class="zo">meu</div>'
}))


test(`creates a view from another component`, viewMacro, () => ({
  input: {
    Component,
    has: 'Hi world!',
    class: {
      another: true
    }
  },
  expected: '<div class="zo another" style="color: black">Hi world!</div>',
  from: sources => ({
    DOM: $.of(div('.zo', {
      style: {
        color: 'black'
      }
    }, 'Hello'))
  })
}))


test(`creates a view that 'has' a component`, viewMacro, () => ({
  input: {
    Component,
    sel: '#zo.bu',
    View: div,
    has: WithView({
      Component,
      sel: '.ga',
      has: 'meu'
    })()
  },
  expected: '<div id="zo" class="bu"><div class="ga">meu</div></div>'
}))

test(`creates a dynamic view`, viewMacro, () => ({
  input: {
    Component,
    class: {
      ga: false,
      zo: true
    },
    from: (component, sources) => ({
      class: {
        bu: true,
        ga: true,
      },
      has: [
        'Hello ',
        component,
        { text: ' !' },
      ]
    })
  },
  expected: '<div class="ga zo bu">Hello world !</div>',
  from: sources => ({ DOM: $.of('world') })
}))
