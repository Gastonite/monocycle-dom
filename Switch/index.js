const { default: $ } = require('xstream')
const noop = require('lodash/noop')
const identical = require('ramda/src/identical')
const either = require('ramda/src/either')
const always = require('ramda/src/always')
const isBoolean = require('lodash/isBoolean')
const isPlainObject = require('lodash/isPlainObject')
const isArray = require('lodash/isArray')
const isFunction = require('lodash/isFunction')
const isString = require('lodash/isString')
const isObject = require('lodash/isObject')
const dropRepeats = require('xstream/extra/dropRepeats').default
const Memoize = require('utilities/memoize')
const mapIndexed = require('ramda/src/addIndex')(require('ramda/src/map'))
const defaultTo = require('ramda/src/defaultTo')
const when = require('ramda/src/when')
const prop = require('ramda/src/prop')
const unless = require('ramda/src/unless')
const pipe = require('ramda/src/pipe')
const over = require('ramda/src/over')
const lensProp = require('ramda/src/lensProp')
const { div } = require('@cycle/dom')
const { Empty } = require('monocycle/component')
const assert = require('browser-assert')

const NotFound = () => ({ DOM: $.of(div('No component found')) })

const WithSwitch = (options = {}, Cycle) => {

  const parseOptions = pipe(
    unless(isPlainObject, Empty),

    over(lensProp('from'), pipe(
      when(isString, prop),
      unless(isFunction, always(noop))
    )),

    over(lensProp('SinksNames'),
      unless(isFunction, always(Object.keys))
    ),

    over(lensProp('first'),
      unless(isBoolean, always(false))
    ),

    over(lensProp('Default'),
      unless(isFunction, always(NotFound))
    ),
    options =>
      over(lensProp('resolve'), pipe(
        defaultTo(noop),
        unless(isFunction, pipe(
          when(isArray, pipe(
            mapIndexed((resolver, i) => {

              if (isFunction(resolver))
                resolver = { resolve: i, value: resolver }

              assert(isObject(resolver), `'resolve[${i}]' must be an object`)

              return {
                ...resolver,
                resolve: isFunction(resolver.resolve)
                  ? resolver.resolve
                  : identical(resolver.resolve)
              }
            }),
            resolvers => (path = '') => {

              const _resolve = resolver => {

                const returned = resolver.resolve(path)

                return returned && (resolved = {
                  resolved: returned,
                  value: resolver.value.isComponent
                    ? resolver.value
                    : resolver.value(returned)
                })
              }

              let resolved
              if (options.first) {
                let returned

                resolvers
                  .some(x => (returned = _resolve(x), returned && (resolved = returned)))

                return returned && resolved.value
              }

              resolved = resolvers
                .map(_resolve)
                .filter(Boolean)

              return resolved.length > 0 && Cycle({
                View,
                has: resolved.map(prop('value'))
              })
            }
          )),
          unless(isFunction, always(noop))
        ))
      ))(options),
  )


  const {
    from,
    SinksNames,
    first,
    View,
    Default,
    resolve = noop
  } = parseOptions(options)

  Cycle.log('WithSwitch()', {
    from,
    SinksNames,
    first,
    View,
    Default,
    resolve
  })

  return f => Cycle(f)

    .after((sinks, sources) => {

      const memoize = Memoize(sources)

      const value$ = (from(sinks, sources) || $.empty())
        .compose(dropRepeats())
        .map(either(resolve, always(Default)))
        .map(memoize)
        .remember()

      return SinksNames(sources).reduce((before, key) => ({
        ...before,
        [key]: value$.map(either(prop(key), $.empty)).flatten()
      }), sinks)
    })
}

const Case = (resolve, value) => ({ resolve, value })

module.exports = {
  default: WithSwitch,
  WithSwitch,
  Case,
}