<template>
  <div class="pso-grid-cpnt-wrapper">
    <div class="pso-grid-cpnt-wrapper-header" :style="headerStyle" v-if="!cpnt.data.headerHidden">
      <div>
        <slot name="header">
          <span>{{ cpnt.urine.child_name }}</span>
        </slot>
      </div>
      <div>
        <i class="el-icon-more" v-if="cpnt.data.moreable" @click="$emit('checkmore')"></i>
        <slot name="action"></slot>
      </div>
    </div>
    <div class="pso-grid-cpnt-wrapper-body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Qs from "qs";
export default {
  props: {
    cpnt: Object,
  },
  computed: {
    headerStyle() {
      return {
        color: this.cpnt.data.headerTextColor,
        "background-color": this.cpnt.data.headerBgColor,
      };
    },
    bodyStyle() {
      return {
        height: !this.cpnt.data.headerHidden ? `calc(100% - 50px)` : "100%",
      };
    },
  },
  methods: {
    checkmore(params = {}) {
      this.$router.push({ path: `${this.cpnt.data.moreTarget}?${Qs.stringify(params)}` });
    },
  },
};
</script>