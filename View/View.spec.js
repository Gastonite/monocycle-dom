const test = require('ava')
const { Stream: $ } = require('xstream')
const { WithView } = require('./View')
const pipe = require('ramda/src/pipe')
const keys = require('ramda/src/keys')
const { Component } = require('monocycle/component')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const { withDOM } = require('../')
const { div } = require('@cycle/dom')
const modules = require('snabbdom-to-html/modules')
const renderVnode = require('snabbdom-to-html/init')([
  modules.class,
  modules.props,
  modules.attributes,
  modules.style
])

withDOM(Component)

const viewMacro = (t, getSpec) => {


  const { input, expected, before } = getSpec()

  t.plan(2)

  const component = WithView(input)
    .apply(void 0,
      isFunction(before)
        ? [before]
        : []
    )

  const sinks = component({ DOM: 1 })

  t.deepEqual(keys(sinks), ['DOM'])

  return sinks.DOM
    .map(renderVnode)
    .map(actual => t.is(actual, expected))
}

test(`creates an empty view`, viewMacro, () => ({
  input: {
    Component,
  },
  expected: '<div></div>'
}))

test(`creates a view`, viewMacro, () => ({
  input: {
    Component,
    sel: '#ga.zo',
    View: div,
    has: 'meu'
  },
  expected: '<div id="ga" class="zo">meu</div>'
}))



test(`creates a view from previous component`, viewMacro, () => ({
  input: {
    Component,
    has: 'Hi world!',
    class: {
      another: true
    }
  },
  expected: '<div class="zo another" style="color: black">Hi world!</div>',
  before: sources => ({
    DOM: $.of(div('.zo', {
      style: {
        color: 'black'
      }
    }, 'Hello'))
  })
}))


test(`creates a nested view`, viewMacro, () => ({
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
  before: sources => ({ DOM: $.of('world') })
}))

test(`creates a dynamic view from an observable`, viewMacro, () => ({
  input: {
    Component,
    has: 'meu',
    from: (component, sources) => $.of({
      has: [
        'Hello ',
        component,
        { text: ' !' },
      ]
    })
  },
  expected: '<div>Hello world !</div>',
  before: sources => ({ DOM: $.of('world') })
}))


test(`creates a dynamic view that overrides predefined options`, viewMacro, () => ({
  input: {
    Component,
    class: {
      ga: false,
      zo: true
    },
    has: 'meu',
    from: (component, sources) => $.of({
      class: {
        bu: true,
        ga: true,
      },
      has: []
    })
  },
  expected: '<div class="ga zo bu">meu</div>',
  before: sources => ({ DOM: $.of('world') })
}))
