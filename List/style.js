const { padding } = require('csstips/lib')

module.exports = ({
  ListItem
} = {}) => {

  return [
    // padding(0),
    {
      $debugName: 'List',
      // listStyle: 'none',
      [`.${ListItem}`]: {
        // background: 'blue'
      }
    }
  ]
}
