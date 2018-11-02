const {
  horizontal,
  horizontallySpaced,
  vertical,
  verticallySpaced,
  content,
  layerParent,
  padding,
  fillParent,
} = require('csstips/lib')
const { rem } = require('csx/lib')
const { media } = require('typestyle')


module.exports = ({
  gutterSize = rem(2.4),
  colors = {},
  breakpoint = 900
} = {}) => {


  const columnStyle = {
    ...vertical,
    '&.spaced': {
      ...verticallySpaced(gutterSize),
      margin: 0,
      // ...padding(gutterSize, 0),
      '.spaced + &': {
        // paddingTop: 0,
      },
    }
  }

  const rowStyle = {
    ...horizontal,
    '&.spaced': {
      '&:not(.col)': {
        ...horizontallySpaced(gutterSize),
        margin: 0,
        // ...padding(gutterSize),
      },
      // 
      '.spaced + &': {
        // paddingLeft: 0,
      },
    }
  }

  return [
    layerParent,
    media({ minWidth: 0, maxWidth: breakpoint }, {
      '&:not(.noAdapt)': columnStyle
    }),
    media({ minWidth: breakpoint }, {
      '&:not(.noAdapt)': rowStyle
    }),
    {
      $debugName: 'Layout',
      backgroundColor: colors.background,
      ...rowStyle,
      '&.fill': fillParent,
      // // '&.spaced': {
      // //   ...horizontallySpaced(gutterSize),
      //   ...padding(gutterSize),
      // //   // '& > .spaced': noPadding,
      // // },
      // ...rowStyle,
      '&.col': columnStyle,
      '& > *': content,
      //   ...content,
      //   // height: '100%'
      // },
    }
  ]
}
