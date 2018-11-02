

// const HeadingButton = makeIconButton(headingIcon)
//   .map(WithClickable())
//   .map(WithTypeWatcher({
//     type: 'header',
//     to: 'isTypeActive$'
//   }))

//   .map(WithSetReducer({ key: 'active', from: 'isTypeActive$' }))

//   .listener({
//     name: 'EditorHeadingToggler',
//     from: (sinks, { codemirror$ = $.empty() }) => codemirror$
//       .map(editor => {

//         return sinks.click$.debug('ToggleHeading.click').map(event => {

//           const startPoint = editor.getCursor("start")
//           const endPoint = editor.getCursor("end")

//           range(startPoint.line, endPoint.line + 1).forEach(i => {

//             let line = editor.getLine(i)
//             const currHeadingLevel = line.search(/[^#]/)

//             editor.replaceRange(
//               currHeadingLevel >= 6
//                 ? line.substr(currHeadingLevel + 1)
//                 : `#${currHeadingLevel <= 0 ? ' ' : ''}` + line,
//               { line: i, ch: 0 },
//               { line: i, ch: line.length + 0 }
//             )
//           })

//           editor.focus()
//         })
//       })
//       .flatten()
//   })
// const { Stream: $ } = require('xstream')
// var fs = require('fs');
// var headingIcon = fs.readFileSync(require.resolve('font-awesome-svg-png/black/svg/header.svg'), 'utf8');

const { default: $ } = require('xstream')
const { WithClickable } = require('components/Clickable')
const range = require('ramda/src/range')
const { WithSetReducer } = require("../SetReducer")
const { WithTypeWatcher, hasTokenType } = require("../TypeWatcher")
const { makeIconButton } = require('components/IconButton')
const { makeBlockToggler } = require('../BlockToggler')
const { WithIconButton } = require('components/IconButton')
const headingIcon = require('fs').readFileSync(require.resolve('font-awesome-svg-png/black/svg/header.svg'), 'utf8');


const makeHeadingButton = ({ classes } = {}) =>
  // makeBlockToggler({
  //   classes,
  //   type: 'heading',
  //   delimiter: '~~',
  //   patterns: {
  //     start: /(\*\*|~~)(?![\s\S]*(\*\*|~~))/,
  //     end: /(\*\*|~~)/
  //   }
  // })
Cycle()
  .map(WithSetReducer({ key: 'active', from: 'isTypeActive$' }))

  .listener({
    name: 'EditorHeadingToggler',
    from: (sinks, { codemirror$ = $.empty() }) => codemirror$
      .map(editor => {

        return sinks.click$.debug('ToggleHeading.click').map(event => {

          const startPoint = editor.getCursor("start")
          const endPoint = editor.getCursor("end")

          range(startPoint.line, endPoint.line + 1).forEach(i => {

            let line = editor.getLine(i)
            const currHeadingLevel = line.search(/[^#]/)

            editor.replaceRange(
              currHeadingLevel >= 6
                ? line.substr(currHeadingLevel + 1)
                : `#${currHeadingLevel <= 0 ? ' ' : ''}` + line,
              { line: i, ch: 0 },
              { line: i, ch: line.length + 0 }
            )
          })

          editor.focus()
        })
      })
      .flatten()
  })
  .map(WithIconButton({ classes, has: headingIcon }))


module.exports = {
  default: makeHeadingButton,
  makeHeadingButton,
}