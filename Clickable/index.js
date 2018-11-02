const { Stream: $ } = require('xstream')
const pipe = require('ramda/src/pipe')
const { WithView } = require('../View')

const WithClickable = (options = {}, Cycle) => {


  const parseOptions = pipe(
    Cycle.coerce,
  )

  const {
    downEvent = { name: 'mousedown' },
    upEvent = { name: 'mouseup' },
  } = options = parseOptions(options)

  const classes = { Clickable: '', ...options.classes }

  const Clickable = Cycle()

    .listener({
      from: (sinks, sources) => $.merge(
        sources.DOM.events(downEvent.name, downEvent.options).mapTo(true),
        sources.DOM.events(upEvent.name, upEvent.options).mapTo(false),
      ),
      to: 'click$'
    })

    .map(WithView({
      sel: '.' + classes.Clickable,
      from: (sinks, sources) =>
        sinks.click$
          .startWith(false)
          .map(click => ({
            class: {
              click
            }
          }))
    }, Cycle))

  return component => Cycle([
    component,
    Clickable
  ])
}


module.exports = {
  default: WithClickable,
  WithClickable
}