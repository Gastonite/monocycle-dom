
let instance

const Codemirror = typeof navigator === 'undefined' ? {} : (
  instance = require('codemirror'),
  // require("codemirror/addon/edit/continuelist.js"),
  // require("codemirror/addon/display/fullscreen.js"),
  // require("codemirror/mode/markdown/markdown.js"),
  // require("codemirror/addon/mode/overlay.js"),
  // require("codemirror/addon/display/placeholder.js"),
  // require("codemirror/addon/selection/mark-selection.js"),
  // require("codemirror/mode/gfm/gfm.js"),
  // require("codemirror/mode/xml/xml.js"),
  require("codemirror/mode/javascript/javascript.js"),
  instance
)

module.exports = Codemirror