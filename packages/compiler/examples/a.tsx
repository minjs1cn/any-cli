import { defineComponent, ref } from 'vue'

export default defineComponent({
  emits: ['click'],

  setup() {
    const state = ref('0')

    const onClick = () => {
      console.log('click')
    }

    return {
      onClick,
      state
    }
  },

  render() {
    return <h1 onClick={onClick}>hello {state}</h1>
  }
})