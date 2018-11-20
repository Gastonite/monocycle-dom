const { cssRaw, cssRule } = require('typestyle')
const { fillParent } = require('csstips/lib/box')
const codemirrorStyle = require('fs').readFileSync(require.resolve('codemirror/lib/codemirror.css'), 'utf8');

const CodemirrorStyle = () => {

  console.error('CodemirrorStyle()')
  cssRaw(codemirrorStyle)

  cssRule('.codemirror', {
    fontSize: '1.2rem',
  })

  cssRule('.CodeMirror', {

    ...fillParent,

  })

  // cssRule('.CodeMirror', {
  //   // border: '1px solid #eee',
  //   height: 'initial'
  // })

  // cssRule('.CodeMirror-scroll', {
  //   height: 'auto',
  //   overflowY: 'hidden',
  //   overflowX: 'auto',
  // })

}

module.exports = {
  default: CodemirrorStyle,
  CodemirrorStyle
}