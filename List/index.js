const lensProp = require('ramda/src/lensProp')
const map = require('ramda/src/map')
const unless = require('ramda/src/unless')
const isFunction = require('ramda-adjunct/lib/isFunction').default
const over = require('ramda/src/over')
const pipe = require('ramda/src/pipe')
const prop = require('ramda/src/prop')
const both = require('ramda/src/both')
const { makeListItem } = require('components/ListItem')
const { WithView } = require('components/View')

const WithList = (options = {}, Cycle) => {

  const {
    sel = '',
    href = '',
    ordered = false,
    has,
    ...viewOptions
  } = parseOptions(options)

  return WithView({
    ...viewOptions,
    classes: {
      List: 'List',
      ...(viewOptions.classes || {})
    },
    has,
    sel: `${ordered ? 'o' : 'u'}l${sel}`,
  })
}


const parseOptions = pipe(
  Cycle.coerce,
  over(lensProp('has'),
    map(
      unless(
        both(isFunction, prop('isListItem')),
        pipe(Cycle.coerce, makeListItem)
      )
    )
  )
)


module.exports = {
  default: WithList,
  WithList
}