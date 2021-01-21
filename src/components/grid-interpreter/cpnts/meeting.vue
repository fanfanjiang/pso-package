<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <div class="pso-grid-meeting" v-if="!initializing">
      <template v-if="list.length">
        <div class="pso-grid-meeting__item" v-for="item in list" :key="item.n">
          <div class="pso-grid-meeting__item-time">
            <el-tag>{{ getDay(item.edu_stime) }}</el-tag>
          </div>
          <div class="pso-grid-meeting__item-info">
            <span>{{ item.d_name }}</span>
            <span>{{ item.tag_name }}</span>
            <span>{{ getTime(item.edu_stime) }}</span>
          </div>
          <i class="el-icon-arrow-right"></i>
        </div>
      </template>
      <pso-empty v-else></pso-empty>
    </div>
    <div v-else style="padding: 15px">
      <pso-skeleton :lines="6"></pso-skeleton>
    </div>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
import dayjs from "dayjs";
export default {
  mixins: [BaseMixin],
  data() {
    return {
      initializing: true,
      list: [],
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.initializing = true;
      const ret = await this.API.getMettings();
      this.list = ret.data;
      this.initializing = false;
    },
    getDay(t) {
      const diffDays = dayjs(t).diff(dayjs(), "day");
      if (diffDays === 0) {
        return "今天";
      } else if (diffDays === 1) {
        return "明天";
      } else {
        return dayjs(t).format("MM-DD");
      }
    },
    getTime(t) {
      return dayjs(t).format("HH:mm");
    },
  },
};
</script>
