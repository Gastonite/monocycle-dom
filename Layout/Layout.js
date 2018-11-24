const { WithView } = require('../View')

const WithLayout = ({ Component }) => {


  return WithView({
    Component,
    sel: '.Layout'
  })
}

module.exports = {
  default: WithLayout,
  WithLayout
}