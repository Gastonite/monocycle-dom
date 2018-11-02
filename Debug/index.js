const stringify = require('monocycle/utilities/stringify')
const { pre } = require('@cycle/dom')
const { default: $ } = require('xstream')

const WithDebug = ({
  View = pre,
  classes = { Debug: 'Debug' },
  from = $.empty
} = {}, Cycle) => {

  const Debug = sources => ({
    DOM: from(sources)
      .map(stringify)
      .map(View.bind(void 0, `.${classes.Debug}`))
  })

  return c => Cycle(
    process.env.NODE_ENV === 'production'
      ? [c]
      : [c, Debug]
  )
}

const WithDebugState = (options = {}, Cycle) => WithDebug({
  ...options,
  from: sources => sources.onion.state$
}, Cycle)

module.exports = {
  default: WithDebug,
  WithDebug,
  WithDebugState,
}