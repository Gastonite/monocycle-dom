const { Stream: $ } = require('xstream')
const dropRepeats = require('xstream/extra/dropRepeats').default
const prop = require('ramda/src/prop')
const lensProp = require('ramda/src/lensProp')
const over = require('ramda/src/over')
const unless = require('ramda/src/unless')
const pipe = require('ramda/src/pipe')
const path = require('ramda/src/path')
const complement = require('ramda/src/complement')
const { WithValidable, makeValidable } = require('components/Validable')
const isPlainObject = require('lodash/isPlainObject')
const isString = require('lodash/isString')
const isFunction = require('lodash/isFunction')
const { makeFieldInput } = require('./Input')
const { makeFieldLabel } = require('./Label')
const { makeFieldMessage } = require('./Message')
const { WithView } = require('components/View')
const { WithTransition } = require('monocycle-state/Transition')
const { WithFocusable } = require('components/Focusable')
const isNonEmptyString = require('predicates/isNonEmptyString')
const KindReducer = require('utilities/kind')
const always = require('ramda/src/always')

const Empty = () => ({})

const parseOptions = pipe(
  unless(isPlainObject, Empty),
  over(lensProp('makeLabel'), unless(isFunction, always(makeFieldLabel))),
  over(lensProp('makeInput'), unless(isFunction, always(makeFieldInput))),
  over(lensProp('makeMessage'), unless(isFunction, always(makeFieldMessage))),
  over(lensProp('name'),
    unless(isNonEmptyString, () => Math.random().toString(36).substring(7))
  ),
  over(lensProp('label'),
    unless(isNonEmptyString, always(''))
  ),
  over(lensProp('validableOptions'), unless(isPlainObject, Empty)),
)


const WithField = (options, Cycle) => {

  const {
    name,
    label,
    makeInput,
    makeLabel,
    makeMessage,
    getFocusEvent$,
    getBlurEvent$,
    validableOptions,
    ...viewOptions
  } = options = parseOptions(options)

  const classes = { Field: 'Field', ...options.classes }

  Cycle.log('WithField()', {
    ...options,
    getFocusEvent$,
    getBlurEvent$,
    makeLabelIsDefault: makeFieldLabel === makeLabel
    // has
  })
  validableOptions.lens = isFunction(validableOptions.lens)
    ? validableOptions.lens
    : lensProp(name)
  return pipe(

    WithFocusable({
      getFocusEvent$,
      getBlurEvent$,
    }),

    WithTransition({
      name: 'initField',
      from: (sinks, sources) =>
        sources.onion.state$
          .filter(complement(prop('isField')))
          .filter(prop('isValidable')),
      reducer: () => pipe(
        KindReducer('Field'),
        state => ({
          ...state,
          name: state.name && isString(state.name)
            ? state.name
            : name,
          label,
          value: state.value,
          viewValue: state.viewValue || state.value,
          isField: true
        })
      )
    }, Cycle),

    WithView({
      classes,
      from: (sinks, sources) => sources.onion.state$
        .filter(prop('isField'))
        .compose(dropRepeats((x, y) =>
          x.viewValue === y.viewValue &&
          x.value === y.value &&
          x.isValid === y.isValid &&
          x.isFocused === y.isFocused
        ))
        .map(({ isValid, isFocused, value, viewValue }) => {
          const isDirty = viewValue !== value

          return {
            class: {
              active: isFocused || viewValue,
              valid: isValid && isDirty,
              invalid: !isValid && isDirty
            }
          }
        })
    }),

    WithView({
      classes,
      sel: `.${classes.Field}`,
      ...viewOptions,
      has: [
        makeLabel({
          classes,
        }),
        makeInput({
          classes,
        }),
        makeMessage({
          classes,
        }),
      ],
    }),

    WithValidable({
      ...validableOptions,
      valueKey: 'viewValue',
      from: (sinks, sources) => (sources.viewValue$ || sources.DOM.events('input')
        .compose(sources.Time.debounce(100))
        .map(path(['target', 'value']))
      ).compose(dropRepeats()),
    }),

  )
}

module.exports = {
  default: WithField,
  WithField
}
