<template>
  <pso-grid-wrapper ref="wrapper" :cpnt="cpnt" @checkmore="checkmore">
    <div class="pso-grid-proindex" v-if="!loading">
      <template v-if="list.length">
        <div class="pso-grid-proindex__item" v-for="item in list" :key="item.d" @click="handleUrlClick(item)">
          <div class="pso-grid-proindex__item-header">
            <div>{{ item.d_name }}</div>
            <el-avatar size="mini">{{ item.d_name }}</el-avatar>
          </div>
          <div class="pso-grid-proindex__item-info">
            <p v-if="item.input_time">开始时间：{{ item.input_time.split(" ")[0] }}</p>
            <div class="pso-grid-proindex__item-status">
              <span>进度：</span>
              <el-progress :text-inside="true" :stroke-width="15" :percentage="item.com_rate"></el-progress>
            </div>
          </div>
          <div class="pso-grid-proindex__item-ctr">
            <span>收款情况：{{ item.sk_money }}/{{ item.pro_money }}</span>
            <span v-if="item.next_money">下期收款：{{ item.hk_time.split(" ")[0] }} ¥{{ item.next_money }}</span>
            <span>
              <i class="el-icon-message-solid"></i>
              {{ item.instance_urgent }}
            </span>
          </div>
          <div class="pso-grid-project__item-tag">
            <span class="text">{{ getStage(item) }}</span>
            <span class="tri" :class="triStyle(item)"></span>
          </div>
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
import Qs from "qs";
import dayjs from "dayjs";
import { BaseMixin } from "../mixin";
export default {
  mixins: [BaseMixin],
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  async created() {
    this.loading = true;
    const cfg = await this.API.getTreeNode({ code: "P000001172293742" });
    if (cfg.data.data.stage_config) {
      this.stages = JSON.parse(cfg.data.data.stage_config);
    }

    const ret = await this.API.getProject();
    this.list = ret.data;
    this.loading = false;
  },
  methods: {
    handleUrlClick(row) {
      window.open(`/tag-card/P000001809709726?${Qs.stringify({ ...row, __data_code__: "P000001172293742", __source_field__: "leaf_id" })}`);
    },
    statusStyle(item) {
      return { color: this.getColor(this.getStage(name)) };
    },
    triStyle(item) {
      const status = this.getStage(item);
      let color = "";
      switch (status) {
        case "未开始":
          color = "s1";
          break;
        case "已延迟":
          color = "s2";
          break;
        case "进行中":
          color = "s3";
          break;
        case "已废弃":
          color = "s4";
          break;
        case "已完结":
          color = "s5";
          break;
      }
      return { [color]: true };
    },
    getStage({ d_status, pro_time, maxtime }) {
      if (d_status === 0) {
        if (dayjs().isBefore(pro_time)) {
          return "未开始";
        } else if (dayjs().isAfter(maxtime)) {
          return "已延迟";
        } else {
          return "进行中";
        }
      } else if (d_status === 1) {
        return "废弃";
      } else {
        return "完结";
      }
    },
    getColor(name) {
      let color = "";
      switch (name) {
        case "未开始":
          color = "#409EFF";
          break;
        case "已延迟":
          color = "#E6A23C";
          break;
        case "进行中":
          color = "#67C23A";
          break;
        case "废弃":
          color = "#F56C6C";
          break;
        case "完结":
          color = "#909399";
          break;
      }
      return color;
    },
  },
};
</script>
