const { horizontal, center, centerCenter, verticallySpaced, horizontallySpaced, vertical, margin, padding } = require('csstips/lib')
const { rem } = require('csx/lib')
const { fontFace } = require('typestyle')


module.exports = ({
  gutterSize = rem(2.4),
  size = rem(6.4),
  smallHeight = rem(3.2),
  bigHeight = rem(9.6),
  colors = {},
  ...options
} = {}) => {

  return [
    center,
    {
      ...options,
      $debugName: 'Bar',
      backgroundColor: colors.background,
      '&:not(.col)': {
        '&.spaced': padding(0, gutterSize),
        height: size,
        minHeight: size,
        '&.small': {
          height: smallHeight,
          minHeight: smallHeight,
        },
        '&.big': {
          height: bigHeight,
          minHeight: bigHeight,
        }
      },
      '&.col': {
        '&.spaced': padding(gutterSize, 0),
        width: size,
        minWidth: size,
        '&.small': {
          width: smallHeight,
          minWidth: smallHeight,
        },
        '&.big': {
          width: bigHeight,
          minWidth: bigHeight,
        }
      },
      [`& > &`]: {
        ...padding(0),
        width: 'inherit',
        height: 'inherit',
      },
    }
  ]
}
