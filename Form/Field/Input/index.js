const dropRepeats = require('xstream/extra/dropRepeats').default
const { WithInput } = require('components/Input')

const WithFieldInput = (options, Cycle) => {

  const {
    has 
  } = options = Cycle.coerce(options)

  const classes = { FieldInput: 'FieldInput', ...options.classes }

  return component => Cycle(component)
    .map(WithInput({
      sel: '.' + classes.FieldInput,
      from: (sinks, sources) =>
        sources.onion.state$
          .compose(dropRepeats())         
          .map(({ value, viewValue }) => ({
            hook: viewValue !== value ? void 0 : {
              insert: vnode => vnode.elm.value = viewValue || '',
              update: (oldVnode, vnode) => vnode.elm.value = viewValue || '',
            }
          }))
    }))
}

module.exports = {
  default: WithFieldInput,
  WithFieldInput
}
