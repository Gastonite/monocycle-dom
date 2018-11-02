const concat = require('ramda/src/concat')
const mergeSelectors = require('snabbdom-merge/merge-selectors')

const WithFlexible = (options = {}, Cycle) => {

  const {
    has = Cycle.Empty,
    sel = '',
    grow,
    shrink,
    basis,
    style = {},
    ...viewOptions
  } = options = Cycle.coerce(options)

  const classes = { Flexible: 'Flexible', ...options.classes }

  Cycle.log('WithFlexible()', { sel, has, sel2: mergeSelectors(sel, `.${classes.Flexible}`) })

  return Cycle.get('View', {
    ...viewOptions,
    sel: mergeSelectors(`.${classes.Flexible}`, sel),
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