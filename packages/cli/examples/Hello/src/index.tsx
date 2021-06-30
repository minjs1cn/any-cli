export default {
  name: 'Hello',

  props: {
    msg: String
  },

  render() {
    return <div>{this.msg}</div>
  }
}