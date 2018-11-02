const { style, classes } = require('typestyle')
const pipe = require('ramda/src/pipe')
const helpers = require('@cycle/dom/lib/cjs/hyperscript-helpers').default
const baseStyle = require('style')

const SvgIconView = pipe(
  helpers.createTagFunction('i'),
  vnode => {

    const { text } = vnode
    const { color, props = {} } = vnode.data


    // console.log('SvgIconView()', { color })
    return {
      ...vnode,
      text: void 0,
      data: {
        ...vnode.data,
        props: {
          ...props,
          className: classes(
            baseStyle.SvgIcon,
            color && style({
              '& > svg circle': {
                stroke: color
              },
              '& > svg path': {
                color
              }

            }),
            props.className
          ),
          innerHTML: text
        }
      }
    }
  }
)

module.exports = SvgIconView
