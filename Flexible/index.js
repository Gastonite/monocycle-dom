
const WithFlexible = (options = {}, Cycle) => {

  const {
    has = Cycle.Empty,
    // sel = '',
    grow,
    shrink,
    basis,
    style = {},
    ...viewOptions
  } = Cycle.coerce(options)

  Cycle.log('WithFlexible()', { 
    has, 
  })
  
  return Cycle.get('View', {
    ...viewOptions,
    style: {
      ...style,
      flexGrow: grow,
      flexShrink: shrink,
      flexBasis: basis,
    },
    has 
  })
}

module.exports = {
  default: WithFlexible,
  WithFlexible,
}