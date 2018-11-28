const test = require('ava')
const { WithLayout } = require('./Layout')
const keys = require('ramda/src/keys')
const { Component } = require('monocycle/component')
const { withDOM } = require('..')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const modules = require('snabbdom-to-html/modules')
const renderVnode = require('snabbdom-to-html/init')([
  modules.class,
  modules.props,
  modules.attributes,
  modules.style
])

// withDOM(Component)

const layoutMacro = (t, getSpec) => {

  const { input, expected, before } = getSpec()

  t.plan(2)

  const component = WithLayout(input)
    .apply(void 0,
      isFunction(before)
        ? [before]
        : []
    )

  const sinks = component({ DOM: void 0 })

  t.deepEqual(keys(sinks), ['DOM'])

  return sinks.DOM
    .map(renderVnode)
    .map(actual => t.is(actual, expected))
}

layoutMacro.title = () => {

  const kind = ''
  return `creates a ${kind}layout`
}

// test(layoutMacro, () => ({
//   input: {
//     Component,
//     // has: 'yo'
//   },
//   expected: '<div class="Layout"></div>'
// }))