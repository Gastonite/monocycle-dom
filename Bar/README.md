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
    'hello world'
  ]
})

```