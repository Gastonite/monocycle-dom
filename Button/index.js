const defaultScope = {
  DOM: 'Button',
  '*': null
}

const WithButton = (options = {}, Cycle) => {

  const {
    has = `I'm an empty Button`,
    scope = defaultScope
  } = options = Cycle.coerce(options)

  // const classes = { Button: '',  }


  const Button = Cycle.get('Clickable').make()
    .map(Cycle.get('DumbButton', {
      ...options,
      has,
    }, Cycle))
  // .isolation(scope)

  return component => Cycle([
    component,
    Button
  ], 'Button')
}

module.exports = {
  default: WithButton,
  WithButton
}