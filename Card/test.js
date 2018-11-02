// const { makeCard } = require('./index.js')
// suite('Array', function() {
//   // setup(function() {
//   //   // ...
//   // });

//   suite('#indexOf()', function() {
//     test('should return -1 when not present', function() {

//       const Card = makeCard()

//       assert.ok(isFunction(Card))

//       // assert.equal(-1, [1,2,3].indexOf(1));
//     });
//   });
// });
const { mockDOMSource } = require('@cycle/dom');
const { select } = require('snabbdom-selector')
const { mockTimeSource } = require('@cycle/time')
const { makeCard } = require('./');
const { ok } = require('assert')
const isFunction = require('lodash/isFunction')
const stringify = require('monocycle/utilities/stringify')
const SnabbdomToHTML = require('snabbdom-to-html')


suite('Card', () => {

  test('increments and decrements in response to clicks', (done) => {
    const Time = mockTimeSource();


    // const addClick$      = Time.diagram(`---x--x-------x--x--|`);
    // const subtractClick$ = Time.diagram(`---------x----------|`);
    // const expectedCount$ = Time.diagram(`0--1--2--1----2--3--|`);
    const expectedView$ = Time.diagram(`A|`, {
      A: '<div></div>'
    });

    const DOM = mockDOMSource({
      // '.add': {
      //   click: addClick$
      // },

      // '.subtract': {
      //   click: subtractClick$
      // },
    });

    const card = makeCard()({ DOM });

    // ok(isFunction(card))
    // const r = stringify(card)

    // Time.assertEqual(
    //   card.DOM.map(SnabbdomToHTML),
    //   expectedView$
    // )

    Time.run(done);
  });
});