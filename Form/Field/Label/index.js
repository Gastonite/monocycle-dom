const { WithLabel } = require('components/Label')
const either = require('ramda/src/either')
const prop = require('ramda/src/prop')
const toUpper = require('ramda/src/toUpper')
const over = require('ramda/src/over')
const append = require('ramda/src/append')
const lensIndex = require('ramda/src/lensIndex')
const join = require('ramda/src/join')
const always = require('ramda/src/always')

const WithFieldLabel = (options = {}, Cycle) => {

  const {
    has,
  } = options = Cycle.coerce(options)

  const classes = { FieldLabel: 'FieldLabel', ...options.classes }

  return WithLabel({
    ...options,
    sel: '.' + classes.FieldLabel,
    from: (sinks, sources) => sources.onion.state$
      .map(either(
        either(
          prop('label'),
          prop('name')
        ),
        always('Unnamed')
      ))
      .map(append(':'))
      .map(over(lensIndex(0), toUpper))
      .map(join(''))
  })
}

module.exports = {
  default: WithFieldLabel,
  WithFieldLabel
}
