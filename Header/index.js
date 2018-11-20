const { makeViewBehavior } = require('components/View')

const WithHeader = makeViewBehavior('header')

module.exports = {
  default: WithHeader,
  WithHeader
}