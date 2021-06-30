import Alert from "./Alert";
import Hello from "./Hello";
import Say from "./Say";
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
  useRotate
}
export default {
  install
}   
