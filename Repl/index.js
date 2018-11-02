
const { Stream: $ } = require('xstream')
const { default: dropRepeats } = require('xstream/extra/dropRepeats')

const pipe = require('ramda/src/pipe')
const when = require('ramda/src/when')
const over = require('ramda/src/over')
const both = require('ramda/src/both')
const path = require('ramda/src/path')
const applyTo = require('ramda/src/applyTo')
const map = require('ramda/src/map')
const complement = require('ramda/src/complement')
const eqProps = require('ramda/src/eqProps')
const defaultTo = require('ramda/src/defaultTo')
const lensIndex = require('ramda/src/lensIndex')
const invoker = require('ramda/src/invoker')
const either = require('ramda/src/either')
const objOf = require('ramda/src/objOf')
const tryCatch = require('ramda/src/tryCatch')
const always = require('ramda/src/always')
const filter = require('ramda/src/filter')
const apply = require('ramda/src/apply')
const ifElse = require('ramda/src/ifElse')
const unless = require('ramda/src/unless')
const mapObjIndexed = require('ramda/src/mapObjIndexed')
const lensProp = require('ramda/src/lensProp')
const isEmpty = require('ramda/src/isEmpty')
const identity = require('ramda/src/identity')
const prop = require('ramda/src/prop')
const castArray = require('lodash/castArray')
const isUndefined = require('lodash/isUndefined')
const isFunction = require('lodash/isFunction')
const isString = require('lodash/isString')
const isPlainObject = require('lodash/isPlainObject')
const { Empty } = require('monocycle/empty')
// const schema = require('./schema.json')
const { div } = require('@cycle/dom')

const WithRepl1 = ({ classes }, Cycle) => {

  return pipe(

    Cycle.get('Layout', {
      classes,
      has: [
        'Codemirror',
        // Cycle.get('Codemirror').make({
        //   classes,
        //   theme: 'darcula',
        //   mode: 'application/json',
        //   from: (sinks, sources) => sources.onion.state$
        //     .compose(dropRepeats(eqProps('value')))
        //     .map(({ value, cursor }) => ({
        //       value,
        //       cursor
        //     }))

        // }).map(Cycle.get('Flexible', {
        //   classes
        // })),

        // Cycle.get('Flexible').make({
        //   sel: 'pre',
        //   classes,
        //   style: {
        //     backgroundColor: '#eee',
        //     color: '#444'
        //   },
        //   has: Cycle.get('View').make({
        //     from: (sinks, sources) => sources.onion.state$
        //       .map(prop('value'))
        //       .compose(dropRepeats())
        //       .map(x =>
        //         $.of(x)
        //           .map(Cycle.parse)
        //           .replaceError(err => console.error('ParseError:', err.message) || $.empty())
        //       )
        //       .flatten()
        //       .remember()
        //   })
        // }),
      ]
    }),

    // Cycle.get('Listener', [
    //   {
    //     from: (sinks, sources) => sinks.cursorActivity$
    //       .compose(sources.Time.debounce(100))

    //       .map(editor => $.of(editor)
    //         .map(editor => ({
    //           value: editor.getValue(),
    //           cursor: editor.getCursor()
    //         }))
    //         .replaceError(err => console.error('ERR', err.message) || $.empty())
    //       )
    //       .flatten(),
    //     combiner: $.merge,

    //     to: 'update$'
    //   },
    //   {
    //     from: (sinks, sources) => sinks.update$.compose(sources.Time.debounce(1000))
    //       .map(update =>
    //         $.of(update)
    //           .map(over(lensProp('value'), pipe(
    //             JSON.parse,
    //             x => JSON.stringify(x, null, 2)
    //           )))
    //           .replaceError(err => console.error('ReplError:', err.message) || $.empty())
    //       )
    //       .flatten(),
    //     combiner: $.merge,
    //     to: 'update$'
    //   }
    // ]),

    // Cycle.get('Transition', [
    //   always({ value: JSON.stringify({ kind: 'Button', has: 'Hello world !' }, null, 2) }),
    //   {
    //     from: 'update$',
    //     name: 'update',
    //     reducer: ({ value, cursor } = {}) => (state = {}) => ({
    //       ...state,
    //       value,
    //       cursor,
    //     })
    //   }
    // ])
  )
}

const ensurePlainObject = unless(isPlainObject, Empty)

const WithRepl = (options, Cycle) => {

  const {
    classes,
    value = '{}'
  } = pipe(
    ensurePlainObject,
    over(lensProp('classes'), ensurePlainObject),
  )(options)

  return component => Cycle([
    component,
    Cycle.get('Layout').make({
      classes,
      gutter: false,
      fill: true,
      has: [
        Cycle.get('Codemirror').make({
          classes,
          viewOptions: {
            style: {
              background: '#bada55',
              position: 'relative'
            }
          },
          theme: 'darcula',
          mode: 'application/json',
          from: (sinks, sources) => sources.onion.state$
            .compose(dropRepeats(eqProps('value')))
            .map(({ value, cursor }) => ({
              value: JSON.stringify(value, null, 2),
              cursor
            }))
        }).map(Cycle.get('Flexible', {
          classes,
          // has: Cycle.get('View').make({
          //   style: {
          //     position: 'absolute',
          //     top: '1rem',
          //     right: '1rem',
          //     color: 'hsla(0, 70%, 50%, 1)'
          //   },
          //   has: 'invalid json'
          // })
        })),

        Cycle.get('Flexible').make({
          sel: 'pre',
          classes,
          has: Cycle.get('View').make({
            from: (sinks, sources) => sources.onion.state$
              .map(prop('value'))
              .compose(dropRepeats())
              // .filter(isString)
              .map(x =>
                $.of(x)
                  .debug('XXX')
                  .map(pipe(
                    // unless(isString, always('{}')),
                    // Cycle.log.partial('jjjjjjjjjjjj'),
                    // JSON.parse,
                    Cycle.parse,
                    component => component.isolation('component')
                  ))
                  .replaceError(err => console.error('ParseError:', err.stack) || $.empty())
              )
              .flatten()
              .remember()
          })
        }),
        Cycle.get('DebugState').make()
      ]
    })
      .listener([
        {
          from: (sinks, sources) => sinks.change$
            .compose(sources.Time.debounce(0))

            .map(editor => $.of(editor)
              .debug('transition.ici')
              .map(editor =>
                $.of(editor.getValue())
                .map(JSON.parse)
                .map(JSON.stringify)
                
                .debug('transition.ici2')
                .compose(dropRepeats())
                .debug('transition.ici3')
                  .map(value => ({
                    value: JSON.parse(value),
                    cursor: editor.getCursor()
                  })))
              .flatten()
              .replaceError(err => console.error('ERR', err.message) || $.empty())
            )
            .flatten().debug('update'),
          combiner: $.merge,
          to: 'update$'
        },
        // {
        //   from: (sinks, sources) => sinks.update$.compose(sources.Time.debounce(2000))
        //     .map(update =>
        //       $.of(update)
        //         .map(over(lensProp('value'), pipe(
        //           JSON.parse,
        //           x => JSON.stringify(x, null, 2),
        //           JSON.parse
        //         )))
        //         .replaceError(err => console.error('ReplError:', err.message) || $.empty())
        //     )
        //     .flatten(),
        //   combiner: $.merge,
        //   to: 'update$'
        // }
      ])

      .transition([
        always({ value }),
        {
          from: 'update$',
          name: 'update',
          reducer: ({ value, cursor } = {}) => (state = {}) => ({
            ...state,
            value,
            cursor,
          })
        }
      ])
  ])
}
module.exports = {
  default: WithRepl,
  WithRepl
}