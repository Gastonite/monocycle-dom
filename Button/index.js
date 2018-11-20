const { Stream: $ } = require('xstream')
const { pipe } = require('monocycle/utilities/pipe')
const { coerce } = require('monocycle/utilities/coerce')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const when = require('ramda/src/when')
const either = require('ramda/src/either')
const always = require('ramda/src/always')
const isEmpty = require('ramda/src/isEmpty')
const log = require('monocycle/utilities/log').Log('Button')
const isFalsy = require('ramda-adjunct/lib/isFalsy').default


const WithButtonOld = (options = {}, Cycle) => {

  console.log('WithButton');
  console.log('WithButton');

  const {
    has = `Button`,
  } = options = Cycle.coerce(options)


  const Button = Cycle.get('Clickable').make({
    upEvent: { name: 'animationend' },
  })
    .map(Cycle.get('DumbButton', {
      ...options,
      has,
    }))

  return component => Cycle([
    component,
    Button
  ], 'Button')
}

const WithButton = pipe(
  coerce,
  over(lensProp('has'),
    when(either(isFalsy, isEmpty), always('Button'))
  ),
  ({ Component, has, ...buttonOptions }) => {

    return pipe(
      Component.get('Clickable', {
        upEvent: { name: 'animationend' },
      }),
      // Component.get('View', {
      //   from: () => $.of({
      //     children: '42'
      //   }),
      // }),
      Component.get('DumbButton', {
        ...buttonOptions,
        has,
      }),

      // Component.get('Listener', {
      //   ...buttonOptions,
      //   has,
      // }),
    )
  }
)

module.exports = {
  default: WithButton,
  WithButton
}