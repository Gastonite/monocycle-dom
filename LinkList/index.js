const { makeLink } = require('components/Link')
const { makeList } = require('components/List')
const { mergeClasses } = require('utilities/style')

const WithLinkList = (options = {}, Cycle) => {

  const {
    has = Cycle.Empty
  } = options = Cycle.coerce(options)


  const classes = { LinkList: 'LinkList', ...options.classes }

  Cycle.log('WithLinkList()', { classes, has })

  const LinkList = makeList({
    classes: mergeClasses(classes, {
      List: classes.LinkList
    }),
    has: has
    .map(Cycle.coerce)
        .map(options => makeLink({
          ...options,
          classes
        }))
  })

  return component => Object.assign(
    Cycle([component, LinkList]),
    { isLinkList: true }
  )
}

module.exports = {
  default: WithLinkList,
  WithLinkList
}