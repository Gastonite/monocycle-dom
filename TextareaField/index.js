const { WithField } = require('components/Form/Field')
const { makeTextareaFieldInput } = require('./Input')
const { mergeClasses } = require('utilities/style')

const WithTextareaField = (options = {}, Cycle) => {

  const {
    classes,
    ...fieldOptions
  } = options = Cycle.coerce(options)

  return WithField({
    ...fieldOptions,
    classes: mergeClasses(classes, {
      Field: classes.TextareaField
    }),
    makeInput: makeTextareaFieldInput,
  })
}

module.exports = {
  default: WithTextareaField,
  WithTextareaField
}