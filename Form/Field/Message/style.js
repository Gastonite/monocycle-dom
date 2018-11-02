const { newLayer, attachToTop } = require('csstips/lib')
const { em } = require('csx/lib')
const { style } = require('typestyle/lib')


module.exports = ({
  colors = {},
  size = em(.7),
} = {}) => {

  return [
    attachToTop,
    {
      $debugName: 'FieldMessage',
      color: colors.default,

      left: 'initial',
      padding: em(.5),
  
      fontSize: size,
      // margin: '4px 0 -20px 0'
  
      // top: size,
      // right: size,
      opacity: 0,
      // '.invalid &': {
      // },
      transition: '.2s ease opacity',
      // opacity: 'var(--opacity)',
  
      '.invalid &': {
        opacity: 1,
        color: colors.invalid
      },
      '.valid &': {
        color: colors.valid
      },
    }
  ]
}
