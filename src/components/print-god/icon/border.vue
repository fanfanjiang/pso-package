<template>
  <div style="font-size: 0px">
    <svg v-if="index === 'none'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1024v1024H0z" fill="#F6F7F8"></path>
      <path d="M0 1024V0h1024v1024H0zM916.210526 107.789474H107.789474v808.421052h808.421052V107.789474z" fill="#C9C9CF"></path>
      <path
        d="M970.105263 538.947368h-431.157895v431.157895H485.052632v-431.157895H53.894737V485.052632h431.157895V53.894737h53.894736v431.157895h431.157895v53.894736z"
        fill="#C9C9CF"
      ></path>
    </svg>
    <svg v-if="index === 'all'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1024v1024H0z" fill="#F6F7F8"></path>
      <path d="M0 1024V0h1024v1024H0zM916.210526 107.789474H107.789474v808.421052h808.421052V107.789474z" fill="#484D55"></path>
      <path
        d="M970.105263 538.947368h-431.157895v431.157895H485.052632v-431.157895H53.894737V485.052632h431.157895V53.894737h53.894736v431.157895h431.157895v53.894736z"
        fill="#484D55"
      ></path>
    </svg>
    <svg v-if="index === 'outer'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1024v1024H0z" fill="#F6F7F8"></path>
      <path d="M0 1024V0h1024v1024H0zM916.210526 107.789474H107.789474v808.421052h808.421052V107.789474z" fill="#484D55"></path>
      <path
        d="M916.210526 538.947368h-377.263158v377.263158H485.052632v-377.263158H107.789474V485.052632h377.263158V107.789474h53.894736v377.263158h377.263158v53.894736z"
        fill="#C9C9CF"
      ></path>
    </svg>
    <svg v-if="index === 'top'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1024v1024H0z" fill="#F6F7F8" p-id="1976"></path>
      <path d="M0 1024V0h1024v1024H0zM916.210526 107.789474H107.789474v808.421052h808.421052V107.789474z" fill="#C9C9CF"></path>
      <path
        d="M970.105263 538.947368h-431.157895v431.157895H485.052632v-431.157895H53.894737V485.052632h431.157895V53.894737h53.894736v431.157895h431.157895v53.894736z"
        fill="#C9C9CF"
      ></path>
      <path d="M0 0h1024v107.789474H0z" fill="#484D55"></path>
    </svg>
    <svg v-if="index === 'bottom'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1024v1024H0z" fill="#F6F7F8"></path>
      <path d="M0 1024V0h1024v1024H0zM916.210526 107.789474H107.789474v808.421052h808.421052V107.789474z" fill="#C9C9CF" p-id="2175"></path>
      <path
        d="M970.105263 538.947368h-431.157895v431.157895H485.052632v-431.157895H53.894737V485.052632h431.157895V53.894737h53.894736v431.157895h431.157895v53.894736z"
        fill="#C9C9CF"
      ></path>
      <path d="M0 916.210526h1024v107.789474H0z" fill="#484D55"></path>
    </svg>
    <svg v-if="index === 'left'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1024v1024H0z" fill="#F6F7F8"></path>
      <path d="M0 1024V0h1024v1024H0zM916.210526 107.789474H107.789474v808.421052h808.421052V107.789474z" fill="#C9C9CF" p-id="2373"></path>
      <path
        d="M970.105263 538.947368h-431.157895v431.157895H485.052632v-431.157895H53.894737V485.052632h431.157895V53.894737h53.894736v431.157895h431.157895v53.894736z"
        fill="#C9C9CF"
      ></path>
      <path d="M0 0h107.789474v1024H0z" fill="#484D55"></path>
    </svg>
    <svg v-if="index === 'right'" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" :width="w" :height="h">
      <path d="M0 0h1024v1024H0z" fill="#F6F7F8"></path>
      <path d="M0 1024V0h1024v1024H0zM916.210526 107.789474H107.789474v808.421052h808.421052V107.789474z" fill="#C9C9CF"></path>
      <path
        d="M970.105263 538.947368h-431.157895v431.157895H485.052632v-431.157895H53.894737V485.052632h431.157895V53.894737h53.894736v431.157895h431.157895v53.894736z"
        fill="#C9C9CF"
      ></path>
      <path d="M916.210526 0h107.789474v1024h-107.789474z" fill="#484D55"></path>
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