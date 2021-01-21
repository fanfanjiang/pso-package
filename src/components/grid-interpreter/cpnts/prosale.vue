<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <div class="pso-grid-prosale" v-if="!initializing">
      <template v-if="list.length">
        <div class="pso-grid-prosale__item" v-for="item in list" :key="item.leaf_id">
          <div class="pso-grid-prosale__item-info">
            <a href="javascript:;">{{ item.d_name }}</a>
            <span>项目类型：{{ item.tag_name }}</span>
          </div>
          <div class="pso-grid-prosale__item-bottom">
            <span>报价金额：{{ item.bj_money }}</span> 
            <span>合同金额：{{ item.ht_money }}</span>
            <span>阶段：{{ item.status_name }}</span>
          </div>
          <div class="pso-grid-project__item-tag">
            <span class="text">{{ item.status_name }}</span>
            <span class="tri" :class="triStyle(item.status_name)"></span>
          </div>
        </div>
      </template>
      <pso-empty v-else></pso-empty>
    </div>
    <pso-skeleton v-if="initializing" :lines="3" :s-style="{ padding: '10px' }"></pso-skeleton>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
export default {
  mixins: [BaseMixin],
  data() {
    return {
      initializing: true,
      list: [],
    };
  },
  async created() {
    this.initializing = true;
    const ret = await this.API.getStatisticData({ tp_code: "P000001627405567", leaf_auth: 4 });
    if (ret.success && ret.data.DATA) {
      this.list = ret.data.DATA.splice(0, 5);
    }
    this.initializing = false;
  },
  methods: {
    checkmore() {
      this.$refs.wrapper.checkmore();
    },
    triStyle(status) {
      let color = "";
      switch (status) {
        case "报备中":
          color = "s1";
          break;
        case "跟踪中":
          color = "s2";
          break;
        case "已签订":
          color = "s3";
          break;
        case "已废弃":
          color = "s4";
          break;
      }
      return { [color]: true };
    },
  },
};
</script>
