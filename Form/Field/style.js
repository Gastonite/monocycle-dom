const { style, classes, stylesheet, cssRaw } = require('typestyle/lib')
// const { colors } = require('style')
const FieldLabelStyle = require('./Label/style')
const FieldInputStyle = require('./Input/style')
const FieldMessageStyle = require('./Message/style')
const { flex, content, centerJustified, horizontal, flexRoot, centerCenter, newLayer, layerParent, attachToBottom, attachToTop } = require('csstips/lib')
const { rem } = require('csx/lib')


// /*

//   primaryColor: '#FFC107',
//   primaryFontColor: 'rgba(0, 0, 0, 0.7)',
//   primaryFontColorDisabled: 'rgba(0, 0, 0, 0.45)',
//   primaryLightWaves: false,
//   secondaryColor: '#009688',
//   secondaryFontColor: 'rgba(255, 255, 255, 0.9)',
//   secondaryFontColorDisabled: 'rgba(255, 255, 255, 0.6)',
//   secondaryLightWaves: true,
//   disabledFontColor: 'rgba(0, 0, 0, 0.35)',
//   labelColor: '#AAA',
//   errorColor: '#C00',
//   successColor: '#090',
//   typographyColor: '#212121',
//   transitionTime: '.3s'
// */

// const disabledFontColor = 'rgba(0, 0, 0, 0.35)'

// // const variables = {
// //   buttonLightWaves: false,
// //   buttonPrimaryLightWaves: false,
// //   buttonSecondaryLightWaves: true,
// //   buttonFontColor: colors.typography,
// //   buttonPrimaryFontColor: 'rgba(0, 0, 0, 0.7)',
// //   buttonSecondaryFontColor: 'rgba(255, 255, 255, 0.9)',
// //   buttonDisabledFontColor: colors.disabledFont,
// //   buttonFlatPrimaryFontColor: colors.primary,
// //   buttonFlatSecondaryFontColor: colors.secondary,
// //   buttonFlatDisabledFontColor: colors.disabledFont,
// //   buttonBackgroundColor: 'transparent',
// //   buttonPrimaryBackgroundColor: colors.primary,
// //   buttonSecondaryBackgroundColor: colors.secondary,
// //   buttonDisabledBackgroundColor: 'rgba(0, 0, 0, 0.12)',
// // }

module.exports = ({
  minHeight = rem(6.4),
  boxShadow = '0 0.5px 0 0 rgba(0, 0, 0, 0.156), 0 1.5px 0 0 rgba(0, 0, 0, 0.055)',
  colors = {}
} = {}) => {

  return [
    layerParent,
    {
      $debugName: 'Field',
      // backgroundColor: bgColor.Field.default,
      // overflow: 'hidden',
      boxShadow,
      minHeight,
      // height: 'auto',
      '&.valid::after': {
        backgroundColor: colors.valid,
      },
      '&.invalid::after': {
        backgroundColor: colors.invalid,
      },
      '&.invalid::after, &.valid::after, &.active::after': {
        left: '0',
        width: '100%',
      },
      '&::after': {
        content: '""',
        ...attachToBottom,
        bottom: -2,
        display: 'block',
        width: '0',
        left: '50%',
        height: '3px',
        transition: '.3s ease all',
        backgroundColor: colors.primary,
      }
    },
    // FieldLabelStyle({ colors }),
    // FieldInputStyle({ colors }),
    // FieldMessageStyle({ colors }),
  ]
}
