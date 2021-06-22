<template>
  <div class="hello-vue">{{msg}}</div>
</template>

<script lang="ts">
export default {
  name: 'hello',

  props: {
    msg: String
  }
}
</script>