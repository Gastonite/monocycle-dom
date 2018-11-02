const { Stream: $ } = require('xstream')
const { div } = require('@cycle/dom')
const unless = require('ramda/src/unless')
const assoc = require('ramda/src/assoc')
const prop = require('ramda/src/prop')
const props = require('ramda/src/props')
const lensProp = require('ramda/src/lensProp')
const apply = require('ramda/src/apply')
const complement = require('ramda/src/complement')
const either = require('ramda/src/either')
const over = require('ramda/src/over')
const pipe = require('ramda/src/pipe')
const merge = require('ramda/src/merge')
const reduce = require('ramda/src/reduce')
const equals = require('ramda/src/equals')
const always = require('ramda/src/always')
const { makeFlexible } = require('components/Flexible')
const { WithView } = require('components/View')
const { WithValidable } = require('components/Validable')
const { WithButton } = require('components/Button')
const { makeBar } = require('components/Bar')
const clone = require('ramda/src/clone')
const dropRepeats = require('xstream/extra/dropRepeats').default
const KindReducer = require('utilities/kind')
const { Log } = require('monocycle/utilities/log')
const isPlainObject = require('lodash/isPlainObject')
const identity = require('lodash/identity')
const isFunction = require('lodash/isFunction')
const { Empty } = require('monocycle/component')
const log = Log('Form')



const WithForm = (options = {}, Cycle) => {

  const parseOptions = pipe(
    Cycle.coerce,
    over(lensProp('requestOptions'), pipe(
      unless(isPlainObject, Empty),
      log.partial('requestOptions'),
      merge({ method: 'post', url: '' }),
    )),
    over(lensProp('formatData'),
      unless(isFunction,
        always(identity)
      ),
    ),
  )
  const {
    classes = {},
    requestOptions,
    formatData,
    has,
  } = options = parseOptions(options)

  return component => Cycle(component)

    .listener({
      from: (sinks, sources) => sources.DOM.events('reset', {
        preventDefault: true
      }),
      combiner: $.merge,
      to: 'resetForm$'
    })

    .map(WithValidable({
      View: div,
      valueKey: 'viewValue',
      has
    }))

    .map(WithView({
      kind: 'form',
      has: makeBar({
        gutter: false,
        classes,
        has: [

          makeFlexible({ classes })
            .map(WithButton({
              classes,
              attrs: {
                type: 'reset'
              },
              has: 'Cancel'
            }))
            .isolation({
              DOM: 'ResetButton',
              '*': null
            }),

          makeFlexible({ classes })
            .map(WithButton({
              classes,
              attrs: {
                type: 'submit'
              },
              has: 'Send'
            }))
            .isolation({
              DOM: 'SubmitButton',
              '*': null
            }),
        ]
      })
    }))

    .transition([
      {
        name: 'initForm',
        from: (sinks, sources) => console.log('initForm', sinks) || $.merge(
          sources.onion.state$
            .filter(complement(prop('isForm')))
            .filter(prop('isValidables'))
            .map(either(prop('value'), Empty))
            .compose(dropRepeats())

            .map(value => $.merge(
              $.of(value),
              sinks.resetForm$.mapTo(value),
            ))
            .flatten(),
          sources.DOM.events('reset', {
            preventDefault: true
          })
            .debug('yeyreset')
        ),
        reducer: value => pipe(
          KindReducer('Form'),
          state => ({
            ...state,
            value: clone(value),
            viewValue: clone(value),
            submitted: void 0,
            isForm: true,
          })
        )
      },
      {
        name: 'submit',
        from: (sinks, sources) =>
          sources.DOM.events('submit', { preventDefault: true }).debug('SUBMIT')/* .addListener(x => x) || $.empty() */,
        reducer: () => unless(
          either(
            complement(prop('isValid')),
            prop('submitted'),
            pipe(props(['value', 'viewValue']), apply(equals))
          ),
          state => (console.log('SUb', state), {
            ...state,
            submitted: {
              at: new Date,
              data: reduce(
                (before, field) => assoc(field.name, field.viewValue, before),
                state.value.id ? { id: state.value.id } : {},
                state.has
              )
            }
          })
        )
      }
    ])

    .listener({
      from: (sinks, sources) => sources.onion.state$
        .filter(prop('isForm'))
        .map(prop('submitted'))
        .filter(Boolean)
        .compose(dropRepeats())
        .map(({ at, data }) => ({
          ...requestOptions,
          send: formatData(data)
        }))
        .map(log.partial('request')),
      to: 'HTTP'
    })
}

module.exports = {
  default: WithForm,
  WithForm,
}
