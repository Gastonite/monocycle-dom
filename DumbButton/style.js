const { keyframes } = require('typestyle/lib')
const { horizontal, centerCenter } = require('csstips/lib')
const { rem } = require('csx/lib')


const raised = 'waves-float'
const baseColors = {
  default: 'hsla(0, 0%, 65%, 1)'
}

const baseBgColors = {
  default: 'transparent'
  // raised: 'transparent',
  // raisedPrimary: 'white',
  // raisedSecondary: colors.primary.toString(),
}
const ButtonStyle = ({
  color = {},
  bgColor = {},
  minHeight = rem(4)
} = {}) => {

  color = { ...baseColors, ...color }
  bgColor = { ...baseBgColors, ...bgColor }

  const sanjaAnimationName = keyframes({
    '0%': {
      opacity: 1,
      transform: 'scale3d(0.5, 0.5, 1)',
    },
    '25%': {
      opacity: 1,
      transform: 'scale3d(1, 1, 1)',
    },
    '100%': {
      opacity: 0,
      transform: 'scale3d(1.25, 1.25, 1.25)',
    },
  })


  return [
    horizontal,
    centerCenter,
    {
      $debugName: 'Button',
      // height: '100%',
      // minWi: '100%',
      minHeight,
      position: 'relative',
      // display: 'inline-block',
      // padding: '0 2rem',
      // padding: 0,
      border: 'none',
      background: 'none',
      color: '#286aab',
      // fontSize: '1.4em',
      overflow: 'visible',
      // -webkit-transition: 'color 0.7s',
      transition: 'color 0.7s',
      // -webkit-tap-highlight-color: 'rgba(0, 0, 0, 0)',
      overflow: 'hidden',
      outline: 'none',
      color: '#3c8ddc',
      border: 0,


      outline: 'none',
      '&:hover, &:active, &:focus': {
        // border: 0,


        outline: 'none',
      },
      '&.click': {


        // Sanja 
        '&::after': {
          animation: `${sanjaAnimationName} 1s ease-out `,
          opacity: 1,
          // transform: 'scale3d(1, 1, 1)'
        },
      },

      '&::after': {
        // transition: 'opacity .2s ease-out',
        // transform: 'scale3d(0.5, 0.5, 1)',

        position: 'absolute',
        margin: 'auto',
        // top: '50%',
        // left: '50%',
        // bottom: 0,
        // right: 0,
        // width: 'calc(100% * 1px)',
        // height: 'auto',
        width: '100%',
        paddingTop: '100%',
        // height: '70px',
        borderRadius: '50%',
        content: '""',
        opacity: 0,
        pointerEvents: 'none',

        // animation: `${sanjaAnimationName} 1s ease-out forwards`,


        // Sanja 
        background: 'rgba(111,148,182,0.05)'

      },

      '&:hover': {
        color: color.hover,
        backgroundColor: bgColor.hover,
      },
      '&.primary': {
        color: color.primary,
        backgroundColor: bgColor.primary,
        '&:hover': {
          color: color.hoverPrimary,
          backgroundColor: bgColor.hoverPrimary,
        },
        [`&.${raised}`]: {
          color: color.raisedPrimary,
          backgroundColor: bgColor.raisedPrimary,
        }
      },
      '&.secondary': {
        color: color.secondary,
        backgroundColor: bgColor.secondary,
        '&:hover': {
          color: color.hoverSecondary,
          backgroundColor: bgColor.hoverSecondary,
        },
        [`&.${raised}`]: {
          color: color.raisedSecondary,
          backgroundColor: bgColor.raisedSecondary,
        }
      },
      '&.disabled': {
        $debugName: 'disabled',
        color: color.disabled,
        backgroundColor: bgColor.disabled,
        [`&.${raised}`]: {
          color: color.raisedDisabled,
          backgroundColor: bgColor.raisedDisabled,
        }
      }
    }]

  // return ({
  //   raised,
  //   Button: classes(
  //     'waves-button',
  //     style()
  //   ),

  //   // primary: style(),
  //   secondary: style({
  //     $debugName: 'secondary',
  //     color: color.secondary,
  //     backgroundColor: bgColor.secondary,
  //     '&:hover': {
  //       color: color.hoverSecondary,
  //       backgroundColor: bgColor.hoverSecondary,
  //     },
  //     [`&.${raised}`]: {
  //       color: color.raisedSecondary,
  //       backgroundColor: bgColor.raisedSecondary,
  //     }
  //   }),
  //   disabled: style({
  //     $debugName: 'disabled',
  //     color: color.disabled,
  //     backgroundColor: bgColor.disabled,
  //     [`&.${raised}`]: {
  //       color: color.raisedDisabled,
  //       backgroundColor: bgColor.raisedDisabled,
  //     }
  //   }),

  //   // primary: style({
  //   //   $debugName: 'primary',
  //   //   color: colors.primary.toString(),
  //   //   [`&.${raised}`]: {
  //   //     color: 'rgba(0, 0, 0, 0.7)',
  //   //     backgroundColor: colors.primary.toString()
  //   //   }
  //   // }),
  //   // secondary: style({
  //   //   color: colors.secondary.toString(),
  //   //   [`&.${raised}`]: {
  //   //     color: 'rgba(255, 255, 255, 0.9)',
  //   //     backgroundColor: colors.secondary.toString()
  //   //   }
  //   // }),
  //   // disabled: style({
  //   //   color: colors.disabledFont.toString(),
  //   //   [`&.${raised}`]: {
  //   //     color: colors.disabledFont.toString(),
  //   //     backgroundColor: 'rgba(0, 0, 0, 0.12)'
  //   //   }
  //   // })
  //   // flat: {
  //   //   enabled: {
  //   //     cursor: 'pointer'
  //   //   },
  //   //   disabled: {
  //   //     color: variables.buttonFlatDisabledFontColor
  //   //   },
  //   //   primary: {
  //   //     color: variables.buttonFlatPrimaryFontColor
  //   //   },
  //   //   secondary: {
  //   //     color: variables.buttonFlatSecondaryFontColor
  //   //   }
  //   // },
  //   // raised: {
  //   //   enabled: {
  //   //     cursor: 'pointer'
  //   //   },
  //   //   disabled: {
  //   //     color: variables.buttonDisabledFontColor,
  //   //     backgroundColor: variables.buttonDisabledBackgroundColor
  //   //   },
  //   //   primary: {
  //   //     color: variables.buttonPrimaryFontColor,
  //   //     backgroundColor: variables.buttonPrimaryBackgroundColor
  //   //   },
  //   //   secondary: {
  //   //     color: variables.buttonSecondaryFontColor,
  //   //     backgroundColor: variables.buttonSecondaryBackgroundColor
  //   //   }
  //   // }

  // })
}

module.exports = {
  default: ButtonStyle,
  ButtonStyle
}
// cssRaw(WavesStyle)
// cssRaw(`

// .waves-button, 
// .waves-button-input, 
// .waves-button:hover, 
// .waves-button:visited {
//   color:  none
// }
// `)
