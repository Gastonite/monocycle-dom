```
  const Layout = makeLayout({
    classes,
    has: [
      Cycle([
        Cycle([
          Cycle([
            makeFlexible({
              factor: 1,
              classes,
              has: 'column 1'
            }),
          ])
        ])
      ]),
      makeFlexible({
        factor: 2,
        classes,
        has: 'column 2'
      }),
      'column 3'
    ]
  })

```

```
const makeDiv = has => Cycle({ View: div, has})

const makeApp = ({ classes }) => makeLayout({
  classes,
  fill: true,
  has: [
    makeBar({
      classes,
      direction: 'column',
      spaced: true,
      style: {
        justifyContent: 'flex-end',
      },
      has: [
        makeDiv('Link1'),
        makeDiv('Link2'),
        makeDiv('Link3'),
        makeBar({
          classes,
          spaced: true,
          direction: 'column',
          has: [
            makeDiv('Link4'),
            makeDiv('Link5'),
            makeDiv('Link6'),
            makeBar({
              classes,
              spaced: true,
              fill: true,
              direction: 'column',
              has: [
                makeDiv('Link7'),
                makeDiv('Link8'),
              ],
            }),
          ],
        }),
      ],
    }),

    makeLayout({
      classes,
      // fill: true,
      spaced: true,
      has: makeLayout({
        classes,
        fill: true,
        direction: 'column',
        spaced: true,
        has: makeDiv('hello world')
      })
    }).map(WithFlexible({ classes }))

  ]
})

```

```
const makeApp = ({ classes }) => {

    return makeLayout({
      classes,
      direction: 'column',
      gutter: false,
      spaced: true,
      has: [

        makeView({
          sel: 'span',
          style: {
            backgroundColor: 'red'
          },
          has: 'ga'
        }),

        makeView({
          sel: 'span',
          style: {
            backgroundColor: 'red'
          },
          has: 'bu'
        }),

        makeView({
          sel: 'span',
          style: {
            backgroundColor: 'red'
          },
          has: 'zo'
        }),

        makeView({
          sel: 'span',
          style: {
            backgroundColor: 'red'
          },
          has: 'meu'
        }),

      ]
    })
  }
  
```