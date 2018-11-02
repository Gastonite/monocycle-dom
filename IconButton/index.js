const { WithButton } = require("components/Button")
const pipe = require("ramda/src/pipe")
const { makeSvgIcon } = require('components/SvgIcon')

const WithIconButton = (options = {}, Cycle) => {

  const parseOptions = pipe(
    Cycle.coerce
  )
  const {
    classes,
    has,
    ...buttonOptions
  } = parseOptions(options)

  Cycle.log('WithIconButton()', { has })

  return f => Cycle(f)
    .map(WithButton({
      ...buttonOptions,
      classes,
      has: makeSvgIcon({
        classes,
        has
      })
    }))
}

module.exports = {
  default: WithIconButton,
  WithIconButton
}