const { WithLayout } = require('../Layout')
const { mergeClasses } = require('../utilities/style')

const WithCard = (options = {}, Cycle) => {

  const {
    classes = {},
    has,
    ...viewOptions
  } = options = Cycle.coerce(options)

  return WithLayout({
    direction: 'column',
    ...viewOptions,
    classes: mergeClasses({ Card: 'Card' }, classes, {
      Layout: classes.Card
    }),
    has,
  })
}

module.exports = {
  default: WithCard,
  WithCard
}