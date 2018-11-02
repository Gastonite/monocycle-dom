const pipe = require('ramda/src/pipe')

const WithBar = (options = {}, Cycle) => {

  const {
    sel = '',
    size,
    dockTo,
    has = Cycle.Empty,
    ...layoutOptions
  } = options = Cycle.coerce(options)

  const classes = { Bar: 'Bar', ...options.classes }
  
  Cycle.log('Bar', { has, classes, layoutOptions })

  return pipe(
    Cycle.get('Layout', {
      // WithLayout({
      ...layoutOptions,
      sel: sel + '.' + classes.Bar,
      classes,
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


module.exports = {
  default: WithBar,
  WithBar,
}
