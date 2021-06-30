import Alert from "./Alert";
import Hello from "./Hello";
import Say from "./Say";
import useRotate from "./hooks/useRotate";

const components = [
  Alert,
  Hello,
  Say
]

function install(Vue){
  components.forEach(component => {
    if (component.install) {
      Vue.use(component)
    } else if (component.name) {
      Vue.component(component.name, component)
    }
  })
}

if (typeof window !== undefined && window.Vue) {
  install(window.Vue)
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
