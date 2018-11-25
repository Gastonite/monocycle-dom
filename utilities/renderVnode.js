const modules = require('snabbdom-to-html/modules')
const renderVnode = require('snabbdom-to-html/init')([
  modules.class,
  modules.props,
  modules.attributes,
  modules.style
])

module.exports = {
  default: renderVnode,
  renderVnode
}