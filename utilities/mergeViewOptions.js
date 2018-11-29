
const mergeSelectors = require('snabbdom-merge/merge-selectors')
const curry = require('ramda/src/curry')
const mergeDeepRight = require('ramda/src/mergeDeepRight')

const mergeViewOptions = curry((defaultOptions, options) => ({
  ...mergeDeepRight(defaultOptions, options),
  sel: mergeSelectors(
    defaultOptions.sel,
    options.sel
  )
}))

module.exports = {
  default: mergeViewOptions,
  mergeViewOptions
}