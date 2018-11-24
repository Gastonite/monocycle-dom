const pipe = require('ramda/src/pipe')
const when = require('ramda/src/when')
const unless = require('ramda/src/unless')
const identical = require('ramda/src/identical')
const defaultTo = require('ramda/src/defaultTo')
const always = require('ramda/src/always')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const { rem } = require('csx/lib/units')
const isBoolean = require('lodash/isBoolean')

const WithLayout = (options = {}, Cycle) => {

  const {
    // sel = '',
    direction,
    fill,
    spaced,
    gutter,
    adapt,
    // has,
    ...viewOptions
  } = options = pipe(
    over(lensProp('gutter'), pipe(
      defaultTo(true),
      when(isBoolean, when(Boolean, always(2)))
    )),
    over(lensProp('direction'), pipe(
      defaultTo('row'),
      unless(identical('row'), always('column'))
    )),
    over(lensProp('spaced'), pipe(
      defaultTo(false),
      Boolean
    )),
    // over(lensProp('adapt'), pipe(
    //   defaultTo(false),
    //   Boolean
    // )),
    over(lensProp('fill'), pipe(
      defaultTo(false),
      Boolean
    )),
    // over(lensProp('sel'), pipe(
    //   unless(isString, always(''))
    // )),
  )(options)

  // const classes = { Layout: 'Layout', ...options.classes }

  Cycle.log('WithLayout()', { spaced, adapt })

  return Cycle.get('View', {
    // sel: concat(sel, `.${classes.Layout}`),
    ...viewOptions,
    class: {
      ...(viewOptions.class || {}),
      col: ['col', 'column', 'vertical'].includes(direction),
      fill,
      spaced,
      noAdapt: adapt === false,
    },
    style: {
      ...(viewOptions.style || {}),
      padding: rem(+gutter)
    },
    // has
  })
}


module.exports = {
  default: WithLayout,
  WithLayout
}