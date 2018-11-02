const { WithView } = require('../View')
const pipe = require('ramda/src/pipe')



const WithDumbButton = (options = {}, Cycle) => {


  const parseOptions = pipe(
    Cycle.coerce,
  )

  const {
    has = `I'm an empty DumbButton`,
  } = options = parseOptions(options)

  const classes = { Button: '', ...options.classes }

  Cycle.log('WithButton()', {
    has
  })
  
  return WithView({
    ...options,
    sel: 'button.' + classes.Button,
    has,
  }, Cycle)
}

module.exports = {
  default: WithDumbButton,
  WithDumbButton
}
