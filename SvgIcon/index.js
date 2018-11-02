const pipe = require('ramda/src/pipe')
const when = require('ramda/src/when')
const unless = require('ramda/src/unless')
const objOf = require('ramda/src/objOf')
const always = require('ramda/src/always')
const over = require('ramda/src/over')
const concat = require('ramda/src/concat')
const lensProp = require('ramda/src/lensProp')
const isUndefined = require('lodash/isUndefined')
const isPlainObject = require('lodash/isPlainObject')
const { makeView } = require('components/View')

const parseOptions = pipe(
  Cycle.coerce,
  unless(isPlainObject, objOf('has')),
  over(lensProp('has'), when(isUndefined, always(`I'm an empty SvgIcon`)))
)

const WithSvgIcon = (options = {}, Cycle) => {

  const {
    sel = '',
    has,
  } = options = parseOptions(options)

  const classes = { SvgIcon: 'SvgIcon', ...options.classes }

  Cycle.log('WithSvgIcon()', { has })
  
  const SvgIcon = Cycle([
    makeView({
      sel: concat('i.', classes.SvgIcon, sel),
      props: {
        innerHTML: has
      }
    })
  ], 'SvgIcon')

  return f => Cycle([f, SvgIcon])
}

module.exports = {
  default: WithSvgIcon,
  WithSvgIcon
}