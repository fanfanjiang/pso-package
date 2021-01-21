<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <div class="pso-grid-news" v-if="!initializing">
      <template v-if="list.length">
        <div class="pso-grid-news__item" v-for="item in list" :key="item.leaf_id">
          <div class="pso-grid-news__item-info">
            <a href="javascript:;">{{ item.d_name }}</a>
            <span>{{ item.inform_info }}</span>
          </div>
          <div class="pso-grid-news__item-time">{{ item.notice_time }}</div>
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
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.initializing = true;
      const ret = await this.API.getNews();
      this.list = ret.data;
      this.initializing = false;
    }
  },
};
</script>
