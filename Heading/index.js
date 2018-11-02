const isInteger = require('lodash/isInteger')
const allPass = require('ramda/src/allPass')
const prop = require('ramda/src/prop')
const when = require('ramda/src/when')
const identity = require('lodash/identity')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const either = require('ramda/src/either')
const pipe = require('ramda/src/pipe')
const lt = require('ramda/src/lt')
const gt = require('ramda/src/gt')
const always = require('ramda/src/always')
const { WithView } = require('components/View')

const parseLevel = when(allPass([isInteger, lt(0), gt(7)]), identity)

const WithHeading = (options = {}, Cycle) => {

  const {
    level,
    has,
  } = options = pipe(
    Cycle.coerce,
    over(lensProp('level'),
      either(
        parseLevel,
        either(
          pipe(
            always(rest),
            prop('0'),
            parseLevel
          ),
          always(1)
        )
      )
    )
  )(options)

  return WithView({
    ...options,
    has,
    sel: `h${level}`
  })
}

module.exports = {
  default: WithHeading,
  WithHeading,
}