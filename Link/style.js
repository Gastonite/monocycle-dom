
module.exports = ({
  colors = {},
  ...override
} = {}) => {

  return {
    $debugName: 'Link',
    color: colors.default,
    ...override
  }

}
