

module.exports = {
  default: () => ({
    $debugName: 'TextareaField',
    '& textarea': {
      resize: 'none',
      minHeight: '12rem'
      // marginTop: em(2)
    }
  })
}