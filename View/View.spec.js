const test = require('ava')
const { Stream: Observable } = require('xstream')
const { WithView } = require('./View')
const pipe = require('ramda/src/pipe')
const keys = require('ramda/src/keys')
const { makeComponent: _makeComponent } = require('monocycle/component')
const { withViewCombiner } = require('../utilities/withViewCombiner')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const { withDefaultView } = require('../utilities/withDefaultView')
const { div } = require('@cycle/dom')
const modules = require('snabbdom-to-html/modules')
const renderVnode = require('snabbdom-to-html/init')([
  modules.class,
  modules.props,
  modules.attributes,
  modules.style
])

const makeComponent = pipe(
  withDefaultView,
  withViewCombiner
)(_makeComponent)

const Component = makeComponent()

const viewMacro = (t, getSpec) => {


  const { input, expected, previousComponent } = getSpec()

  t.plan(2)

  const component = WithView(input)
    .apply(void 0,
      isFunction(previousComponent)
        ? [previousComponent]
        : []
    )

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
  previousComponent: sources => ({
    DOM: Observable.of(div('.zo', {
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

test(`creates a dynamic view from a plain object`, viewMacro, () => ({
  input: {
    Component,
    has: 'meu',
    from: (component, sources) => ({
      has: [
        'Hello ',
        component,
        { text: ' !' },
      ]
    })
  },
  expected: '<div>Hello world !</div>',
  previousComponent: sources => ({ DOM: Observable.of('world') })
}))

test(`creates a dynamic view from an observable`, viewMacro, () => ({
  input: {
    Component,
    has: 'meu',
    from: (component, sources) => Observable.of({
      has: [
        'Hello ',
        component,
        { text: ' !' },
      ]
    })
  },
  expected: '<div>Hello world !</div>',
  previousComponent: sources => ({ DOM: Observable.of('world') })
}))


test(`creates a view with dynamic classes`, viewMacro, () => ({
  input: {
    Component,
    class: {
      ga: false,
      zo: true
    },
    has: 'meu',
    from: (component, sources) => Observable.of({
      class: {
        bu: true,
        ga: true,
      },
      has: []
    })
  },
  expected: '<div class="ga zo bu">meu</div>',
  previousComponent: sources => ({ DOM: Observable.of('world') })
}))
