const { padding } = require('csstips/lib')


module.exports = ({
  colors = {},
} = {}) => {

  return [
    {
      $debugName: 'Navigation',
      backgroundColor: colors.background,
      '& > ul': {
        listStyle: 'none',
        ...padding(0),
        fontSize: '1.2em'
      }
    }
  ]
}
