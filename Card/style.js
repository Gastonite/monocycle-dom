const { rem } = require('csx')

module.exports = ({
  gutterSize = rem(2),
  colors = {
    background: 'white'
  },
  Layout
} = {}) => {

  return [
    {
      $debugName: 'Card',
      // [`&.${Layout}`]: {
      //   // backgroundColor: 'red',
      //   // ...padding(gutterSize),
      //   // '&.spaced': {
      //   //   ...padding(gutterSize),
      //   //   // '& > .spaced': padding(gutterSize),
      //   // },
      // },
      // '& > &': {
      //   backgroundColor: 'red',
      //   ...margin(gutterSize)
      // },

      
      backgroundColor: colors.background,
      overflow: 'hidden',
      borderRadius: rem(.3),
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.2), ' +
        '0 1px 1px 0 rgba(0, 0, 0, 0.14), ' +
        '0 2px 1px -1px rgba(0, 0, 0, 0.12)'
    }
  ]
}
