const isString = require('lodash/isString')

const WithSetReducer = ({
  key = 'value',
  from = 'value$'
} = {}, Cycle) => {

  if (!isString(key))
    throw new Error(`'key' must be a string`)

  return f => Cycle(f)
    .transition({
      name: 'set',
      from,
      reducer: value => (state = {}) =>
        value === state[key] ? state : ({
          ...state,
          [key]: value
        })
    })
}

module.exports = {
  default: WithSetReducer,
  WithSetReducer
}