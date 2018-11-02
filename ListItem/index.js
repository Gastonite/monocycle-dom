const { makeView } = require('components/View')

const WithListItem = (options = {}, Cycle) => {

  const {
    sel = '',
    has,
    ...viewOptions
  } = options = Cycle.coerce(options)


  const classes = { ListItem: 'ListItem', ...options.classes }
  
  Cycle.log('WithListItem()', { classes, has })

  const ListItem = makeView({
    ...viewOptions,
    sel: `li.${classes.ListItem}${sel}`,
    has,
  })

  return component => Object.assign(
    Cycle([component, ListItem]),
    { isListItem: true }
  )
}

module.exports = {
  default: WithListItem,
  WithListItem
}