const path = require('ramda/src/path')
const prop = require('ramda/src/prop')
const filter = require('ramda/src/filter')
const assocPath = require('ramda/src/assocPath')
const assoc = require('ramda/src/assoc')
const pipe = require('ramda/src/pipe')
const map = require('ramda/src/map')
const all = require('ramda/src/all')
const defaultTo = require('ramda/src/defaultTo')
const either = require('ramda/src/either')
const reduce = require('ramda/src/reduce')
const over = require('ramda/src/over')
const unless = require('ramda/src/unless')
const lensProp = require('ramda/src/lensProp')
const equals = require('ramda/src/equals')
const always = require('ramda/src/always')
const identity = require('ramda/src/identity')
const when = require('ramda/src/when')
const castArray = require('lodash/castArray')
const isNonEmptyString = require('predicates/isNonEmptyString')
const complement = require('ramda/src/complement')
const { WithView } = require('components/View')
const log = require('monocycle/utilities/log').Log('FieldGroup')
const KindReducer = require('utilities/kind')

const getFieldPath = pipe(
  either(
    prop('path'),
    prop('name')
  ),
  castArray,
  filter(isNonEmptyString),
)

const WithFieldGroup = (options = {}, Cycle) => {

const parseOptions = pipe(
  Cycle.coerce,
  over(lensProp('ItemScope'), 
    unless(isFunction, always(identity))
  )
)

  const {
    ItemScope = identity,
    has 
  } = parseOptions(options)


  return component => Cycle(component)

    .map(WithView({
      has: has 
        .filter(Boolean)
        .map((field, i) =>
          field.isolation(ItemScope('' + i, field))
        )
    }))

    .isolation({
      onion: {
        get: (state = {}) => pipe(
          prop('has'),
          defaultTo(Array(has.length).fill(void 0)),
          map(when(prop('isField'), (field = {}) => {

            const fieldPath = getFieldPath(field)

            const value = pipe(
              prop('value'),
              path(fieldPath)
            )(state)

            const viewValue = pipe(
              prop('viewValue'),
              path(fieldPath)
            )(state)

            return pipe(
              when(
                pipe(prop('value'), complement(equals(value))),
                assoc('value', value),
              ),
              when(
                pipe(prop('viewValue'), complement(equals(viewValue))),
                assoc('viewValue', viewValue),
              )
            )(field)
          })),
        )(state),
        set: (state, fields) => ({

          ...reduce((before, field) => {

            const path = getFieldPath(field)

            return path.length < 1 ? before : pipe(
              assoc('value', assocPath(path, field.value, before.value)),
              assoc('viewValue', assocPath(path, field.viewValue, before.viewValue)),
            )(before)
          }, state, fields),

          has: fields,
          isValid: all(prop('isValid'))(fields)
        })
      },
      '*': null
    })

    .transition({
      name: 'initFieldGroup',
      from: (sinks, sources) =>
        sources.onion.state$
          .filter(complement(prop('isFieldGroup')))
          .map(log.partial('FieldGroup.bef1')),
      reducer: () => pipe(
        KindReducer('FieldGroup'),
        assoc('isFieldGroup', true),
        over(lensProp('has'), pipe(
          castArray,
          unless(
            all(prop('isField')),
            always([]),
          )
        ))
      )
    })
}

module.exports = {
  default: WithFieldGroup,
  WithFieldGroup
}