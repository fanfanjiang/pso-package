<template>
  <div style="font-size: 0px">
    <svg v-if="index === 'center'" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M307.2 0h614.4v204.8H307.2V0zM0 409.6h1228.8v204.8H0V409.6z m307.2 409.6h614.4v204.8H307.2V819.2z" fill="#000000"></path>
    </svg>
    <svg v-if="index === 'left'" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1228.8v204.8H0V0z m0 409.6h1228.8v204.8H0V409.6z m614.4 409.6h614.4v204.8H614.4V819.2z" fill="#000000"></path>
    </svg>
    <svg v-if="index === 'right'" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1228.8v204.8H0V0z m0 409.6h1228.8v204.8H0V409.6z m0 409.6h614.4v204.8H0V819.2z" fill="#000000"></path>
    </svg>
  </div>
</template>
<script>
export default {
  props: {
    index: String,
    w: {
      type: Number,
      default: 22,
    },
    h: {
      type: Number,
      default: 22,
    },
  },
};
</script>