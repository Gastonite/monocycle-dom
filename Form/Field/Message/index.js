const { WithView } = require('components/View')
const either = require('ramda/src/either')
const path = require('ramda/src/path')
const always = require('ramda/src/always')

const WithFieldMessage = (options = {}, Cycle) => {


  options = Cycle.coerce(options)

  const classes = { FieldMessage: 'FieldMessage', ...options.classes }

  return WithView({
    sel: '.' + classes.FieldMessage,
    from: (sinks, sources) => sources.onion.state$
      .map(either(path(['error', 'message']), always(''))),
    ...options,
  })
}

module.exports = {
  default: WithFieldMessage,
  WithFieldMessage
}
