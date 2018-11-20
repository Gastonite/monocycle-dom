
const mergeSelectors = require('snabbdom-merge/merge-selectors')

const mergeOptions = (defaultOptions, options) => {

  console.log('mergeOptions()', {
    defaultOptions, options
  })

  return ({
    ...defaultOptions,
    ...options,
    sel: mergeSelectors(defaultOptions.sel, options.sel)
  })
}

module.exports = {
  default: mergeOptions,
  mergeOptions
}