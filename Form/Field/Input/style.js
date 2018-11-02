const { rem } = require('csx/lib')

module.exports = ({
  colors = {},
  height = rem(6.4)
} = {}) => {

  return [
    {
      $debugName: 'FieldInput',
      color: colors.default,
      padding: '.9em .75em .2em',
      width: '100%',
      height,
      border: 'none',
      outline: 'none',
      overflow: 'hidden',
      transition: '.2s ease opacity',
      backgroundColor: 'transparent',
      opacity: 0,
      '.active &, .valid &, .invalid &': {
        opacity: 1
      },
    }
  ]
}
