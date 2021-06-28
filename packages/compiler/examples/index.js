
import "./index-sfc.css";

import { createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue"

const _hoisted_1 = /*#__PURE__*/_createVNode("h1", null, "hh", -1 /* HOISTED */)
const _hoisted_2 = /*#__PURE__*/_createVNode("h1", { class: "hello" }, "{title}", -1 /* HOISTED */)

function __vue_render__(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", null, [
    _hoisted_1,
    _hoisted_2
  ]))
}
export default {
  __scopeId: "data-v-4892cbc6",


  render: __vue_render__,

  data () {
    return {
      title: 'hello'
    }
  }
}
