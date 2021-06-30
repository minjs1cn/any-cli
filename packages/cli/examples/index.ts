import Alert from "./Alert";
import Hello from "./Hello";
import Say from "./Say";
import useA from "./hooks/useA";
import useHaha from "./hooks/useHaha";
import useRotate from "./hooks/useRotate";
import { App } from "vue";

const components = [
  Alert,
  Hello,
  Say
]

function install(Vue: App){
  components.forEach(component => {
    if (component.install) {
      Vue.use(component)
    } else if (component.name) {
      Vue.component(component.name, component)
    }
  })
}

export {
  install,
  Alert,
  Hello,
  Say,
  useA,
  useHaha,
  useRotate
}
export default {
  install
}   
