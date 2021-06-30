export default {
  name: 'say',

  props: {
    msg: String
  },

  render() {
    return <div>{this.msg}</div>
  }
}