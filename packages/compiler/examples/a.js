import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
import { defineComponent, ref } from 'vue';
export default defineComponent({
  emits: ['click'],
  setup: function setup() {
    var state = ref('0');

    var onClick = function onClick() {
      console.log('click');
    };

    return {
      onClick: onClick,
      state: state
    };
  },
  render: function render() {
    return _createVNode("h1", {
      "onClick": onClick
    }, [_createTextVNode("hello "), state]);
  }
});