const { WithView } = require('components/View')

const WithImage = (options = {}, Cycle) => {

  const {
    sel = '',
    has,
    ...viewOptions
  } = Cycle.coerce(options)

  const classes = { Image: 'Image', ...options.classes }

  return WithView({
    sel: 'img.' + classes.Image +  sel,
    ...viewOptions,
    has 
  })
}

module.exports = {
  default: WithImage,
  WithImage
}