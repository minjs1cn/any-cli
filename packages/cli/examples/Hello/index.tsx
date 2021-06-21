export default {
  name: 'hello',

  props: {
    msg: String
  },

  render() {
    return <div>{this.msg}</div>
  }
}