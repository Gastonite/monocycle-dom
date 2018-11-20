const pipe = require('ramda/src/pipe')
const lensProp = require('ramda/src/lensProp')
const over = require('ramda/src/over')
const unless = require('ramda/src/unless')
const isNonEmptyString = require('ramda-adjunct/lib/isNonEmptyString').default
const always = require('ramda/src/always')

const WithBar1 = (options = {}, Cycle) => {

  const {
    // sel = '',
    size,
    dockTo,
    has = Cycle.Empty,
    ...layoutOptions
  } = options = Cycle.coerce(options)

  // const classes = { Bar: 'Bar', ...options.classes }

  Cycle.log('Bar', { has, layoutOptions })

  return pipe(
    Cycle.get('Layout', {
      // WithLayout({
      sel: '.Bar',
      ...layoutOptions,
      // classes,
      adapt: false,
      class: {
        ...(layoutOptions.class || {}),
        big: size === 'big',
        small: size === 'small',
      },
      has,
    }),
  )
}

const WithBar = (options = {}, Cycle) => {

  const {
    has = name,
    sel
  } = options = pipe(
    Cycle.coerce,
    over(lensProp('sel'), unless(isNonEmptyString,
      always(void 0)
    ))
  )(options)

  Cycle.log(`WithBar()`, {
    has,
    sel,
    ...options
  })

  return Cycle.get('View', {
    ...options,
    sel: !sel ? defaultSelector : mergeSelectors(defaultSelector, sel),
    has,
  })
}


module.exports = {
  default: WithBar,
  WithBar,
}
