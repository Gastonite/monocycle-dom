const { Stream: $ } = require('xstream')
const over = require('ramda/src/over')
const pipe = require('ramda/src/pipe')
const always = require('ramda/src/always')
const objOf = require('ramda/src/objOf')
const prop = require('ramda/src/prop')
const unless = require('ramda/src/unless')
const filter = require('ramda/src/filter')
const map = require('ramda/src/map')
const apply = require('ramda/src/apply')
const lensProp = require('ramda/src/lensProp')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const ensureArray = require('ramda-adjunct/lib/ensureArray').default
const mergeViews = require('snabbdom-merge/merge-all')
const log = require('monocycle/utilities/log').Log('ViewCombiner')
const mergeSelectors = require('snabbdom-merge/merge-selectors')
const merge = require('ramda/src/merge')

const makeViewCombiner = pipe(
  prop('View'),
  // log.partial(1),

  unless(isFunction, always(pipe(
    ensureArray,
    filter(Boolean),
    apply(mergeViews),
  ))),
  // log.partial(2),
  map,
  render => pipe(
    ensureArray,
    apply($.combine),
    render
  ),
  objOf('DOM')
)
const mergeViewOptions = (defaultOptions, options) => ({
  ...merge(defaultOptions, options),
  sel: mergeSelectors(defaultOptions.sel, options.sel)
})

const withViewCombiner = makeComponent => pipe(
  ensurePlainObj,
  // log.partial(1),
  over(lensProp('Combiners'),
    unless(isFunction, always(makeViewCombiner))
  ),
  // log.partial(2),

  over(lensProp('mergeOptions'),
    unless(isFunction, always(mergeViewOptions))
  ),
  // log.partial(3),
  makeComponent
)

module.exports = {
  default: withViewCombiner,
  withViewCombiner,
  makeViewCombiner
}