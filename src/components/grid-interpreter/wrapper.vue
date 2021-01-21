<template>
  <div class="pso-grid-cpnt-wrapper">
    <div class="pso-grid-cpnt-wrapper-header">
      <div>
        <span>{{ cpnt.urine.child_name }}</span>
      </div>
      <div>
        <i class="el-icon-more" v-if="cpnt.data.moreable" @click="$emit('checkmore')"></i>
        <slot name="action"></slot>
      </div>
    </div>
    <div class="pso-grid-cpnt-wrapper-body">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Qs from 'qs';
export default {
  props: {
    cpnt: Object,
  },
  methods: {
    checkmore(params = {}) {
      this.$router.push({ path: `${this.cpnt.data.moreTarget}?${Qs.stringify(params)}` });
    },
  },
};
</script>