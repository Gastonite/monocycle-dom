const { mockDOMSource } = require('@cycle/dom')
const { mockTimeSource } = require('@cycle/time')

const withTime = test => (...args) => {
  const Time = mockTimeSource()

  test(Time, ...args)

  return new Promise((resolve, reject) =>
    Time.run(err => err ? reject(err) : resolve(true))
  )
}

module.exports = {
  default: withTime,
  withTime
}