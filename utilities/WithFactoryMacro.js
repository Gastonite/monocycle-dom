const WithFactoryMacro = factory => test => (t, args = [], ...others) => test(t, factory(...args), ...others)

module.exports = {
  default: WithFactoryMacro,
  WithFactoryMacro
}