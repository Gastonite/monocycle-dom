// const { ViewCombiner } = require('monocycle-dom/utilities/withViewCombiner')

const { pipe } = require('monocycle/utilities/pipe')
const { assign } = require('monocycle/utilities/assign')
// const log = require('monocycle/utilities/log').Log('DOM')
const { mergeOptions } = require('./utilities/mergeOptions')
const always = require('ramda/src/always')
const objOf = require('ramda/src/objOf')
const when = require('ramda/src/when')
const prop = require('ramda/src/prop')
const map = require('ramda/src/map')
const unless = require('ramda/src/unless')
const filter = require('ramda/src/filter')
const apply = require('ramda/src/apply')
const { Stream: $ } = require('xstream')
const isFalsy = require('ramda-adjunct/lib/isFalsy').default
const isFunction = require('ramda-adjunct/lib/isFunction').default
const ensureArray = require('ramda-adjunct/lib/ensureArray').default
const mergeViews = require('snabbdom-merge/merge-all')

const makeDefaultView = pipe(
  // log.partial('makeDefaultView()'),
  when(isFalsy, always('')),
  $.of,
  objOf('DOM'),
  always
)


const ViewCombiner = pipe(
  // log.partial('ViewCombiner()'),
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
  // objOf('DOM')
)

const withDOM = Component => {

  const Combiners = Component.Combiners

  return pipe(
    assign({
      makeDefault: makeDefaultView,
      Combiners: options => ({
        ...Combiners(options),
        DOM: ViewCombiner(options)
      }),
    }),
  )(Component)
}




module.exports = {
  default: withDOM,
  withDOM,
  ViewCombiner,
  makeDefaultView,
  mergeOptions
}