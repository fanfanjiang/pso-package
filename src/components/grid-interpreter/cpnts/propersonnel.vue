<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <common-info :list="list" n="d_status_x" v="total" unit="人">
      <div class="pso-grid-propersonnel" v-if="!initializing">
        <div class="pso-grid-propersonnel__item" v-for="item in data" :key="item.v">
          <el-progress type="circle" :percentage="item.d" :width="60"></el-progress>
          <p>{{ item.n }}</p>
          <div>{{ item.v }}</div>
        </div>
      </div>
      <div v-else style="padding: 15px">
        <pso-skeleton :lines="6"></pso-skeleton>
      </div>
    </common-info>
  </pso-grid-wrapper>
</template>
<script>
import CommonInfo from "../common-info";
import { BaseMixin } from "../mixin";
export default {
  components: { CommonInfo },
  mixins: [BaseMixin],
  data() {
    return {
      initializing: false,
      list: [],
      data: [],
    };
  },
  async created() {
    this.initializing = true;
    const ret = await this.API.getPersonnel();
    this.list = ret.data;
    this.initializing = false;
  },
};
</script>
