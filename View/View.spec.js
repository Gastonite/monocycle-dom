const test = require('ava')
const { Stream: $ } = require('xstream')
const { WithView } = require('./View')
const keys = require('ramda/src/keys')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const ensureArray = require('ramda-adjunct/lib/ensureArray').default
const { div } = require('@cycle/dom')
const { mockTimeSource } = require('@cycle/time')
const { renderVnode } = require('../utilities/renderVnode')

const viewMacro = (t, getSpec) => {

  const {
    input,
    expected,
    expectedSinks = ['DOM'],
    before
  } = getSpec()

  t.plan(2)

  const component = WithView(...ensureArray(input))
    .apply(void 0,
      isFunction(before)
        ? [before]
        : []
    )

  const sinks = component({ DOM: 1 })

  t.deepEqual(
    keys(sinks),
    expectedSinks
  )

  return sinks.DOM
    .map(renderVnode)
    .map(actual => t.is(actual, expected))
}

test(`creates an empty dumb view (with no arguments)`, viewMacro, () => ({
  args: [],
  expected: '<div></div>'
}))

test(`creates an empty dumb view (with no options)`, viewMacro, () => ({
  args: {},
  expected: '<div></div>'
}))

test(`creates a view`, viewMacro, () => ({
  input: {
    sel: '#ga.zo',
    has: 'meu'
  },
  expected: '<div id="ga" class="zo">meu</div>'
}))



test(`creates a dumb view from previous component`, viewMacro, () => ({
  input: {
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


test(`creates a dumb view within a dumb view`, viewMacro, () => ({
  input: {
    sel: '#zo.bu',
    has: WithView({
      sel: '.ga',
      has: 'meu'
    })()
  },
  expected: '<div id="zo" class="bu"><div class="ga">meu</div></div>'
}))

test(`creates a reactive view`, viewMacro, () => ({
  before: sources => ({ ga: $.of('world') }),
  input: {
    children: 'meu',
    from: (sinks, sources) => sinks.ga.map(ga => ({
      children: [
        'Hello ',
        ga,
        { text: ' !' },
      ]
    }))
  },
  expectedSinks: ['ga', 'DOM'],
  expected: '<div>Hello world !</div>',
}))

// test(`creates a dynamic view`, viewMacro, () => ({
//   input: {
//     has: 'meu',
//     from: (component, sources) => ({
//       has: [
//         'Hello ',
//         component,
//         { text: ' !' },
//       ]
//     })
//   },
//   expected: '<div>Hello world !</div>',
//   before: sources => ({ DOM: $.of('world') })
// }))

// test(`creates a dynamic view from an observable`, viewMacro, () => ({
//   input: {
//     has: 'meu',
//     from: (component, sources) => $.of({
//       has: [
//         'Hello ',
//         component,
//         { text: ' !' },
//       ]
//     })
//   },
//   expected: '<div>Hello world !</div>',
//   before: sources => ({ DOM: $.of('world') })
// }))


// test(`creates a dynamic view that overrides predefined options`, viewMacro, () => ({
//   input: {
//     class: {
//       ga: false,
//       zo: true
//     },
//     has: 'meu',
//     from: (component, sources) => $.of({
//       class: {
//         bu: true,
//         ga: true,
//       },
//       has: []
//     })
//   },
//   expected: '<div class="ga zo bu">meu</div>',
//   before: sources => ({ DOM: $.of('world') })
// }))


const withTime = (test) => {
  return function () {
    const Time = mockTimeSource();

    test(Time);

    return new Promise((resolve, reject) =>
      Time.run(err => err ? reject(err) : resolve(true))
    )
  }
}



// test(`bla`, (done) => {

//   const Time = mockTimeSource();

//   const addClick$ = Time.diagram(`---x--x-------x--x--|`);
//   const subtractClick$ = Time.diagram(`---------x----------|`);
//   const expectedCount$ = Time.diagram(`0--1--2--1----2--3--|`);

//   // const DOM = mockDOMSource({
//   //   '.add': {
//   //     click: addClick$
//   //   },

//   //   '.subtract': {
//   //     click: subtractClick$
//   //   },
//   // });

//   // const counter = Counter({ DOM });

//   // const count$ = counter.DOM.map(vtree => select('.count', vtree)[0].text);

//   Time.assertEqual(addClick$, addClick$)

//   return Time.run(done);

// })
