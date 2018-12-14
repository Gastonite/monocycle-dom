const pipe = require('ramda/src/pipe')
const when = require('ramda/src/when')
const unless = require('ramda/src/unless')
const identical = require('ramda/src/identical')
const defaultTo = require('ramda/src/defaultTo')
const always = require('ramda/src/always')
const prop = require('ramda/src/prop')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const { rem } = require('csx/lib/units')
const isBoolean = require('lodash/isBoolean')
const { Component } = require('monocycle')
const { ensurePlainObj } = require('monocycle/utilities/ensurePlainObj')
const { coerce } = require('monocycle/utilities/coerce')
const tap = require('ramda/src/tap')
const merge = require('ramda/src/merge')
const __ = require('ramda/src/__')
const assoc = require('ramda/src/assoc')
const { WithView } = require('../View')
const isFunction = require('ramda-adjunct/lib/isFunction').default

const WithLayout = pipe(
  coerce,
  over(lensProp('Component'), pipe(
    unless(isFunction, () =>
      pipe(
        WithSymbols({
          mergeOptions: mergeViewOptions
        }),
      )(makeComponent({
        Default: DefaultView,
        Combiners: options => ({
          DOM: ViewCombiner(options)
        })
      }))
    )
  )),
  tap(() => {

    Component.set('View', WithView)
    Component.set('DumbLayout', 'View', {
      sel: '.Layout'
    })
  }),
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
  ({
    // sel = '',
    direction,
    fill,
    spaced,
    gutter,
    adapt,
    // has,
    ...viewOptions
  }) => {

    return Component.get('DumbLayout', {
      ...viewOptions,
      class: pipe(
        prop('class'),
        ensurePlainObj,
        merge(__, {
          col: ['col', 'column', 'vertical'].includes(direction),
          fill,
          spaced,
          noAdapt: adapt === false,
        })
      )(viewOptions),
      style: pipe(
        prop('style'),
        ensurePlainObj,
        assoc('--gutter', rem(+gutter))
      )(viewOptions),
      // style: {
      //   ...(viewOptions.style || {}),
      //   // padding: rem(+gutter)
      //   '--gutter': rem(+gutter)
      // },
    })
  }
)


module.exports = {
  default: WithLayout,
  WithLayout
}