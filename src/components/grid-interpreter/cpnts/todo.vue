<template>
  <pso-grid-wrapper :cpnt="cpnt">
    <div class="pso-grid-todo">
      <div class="pso-grid-todo__body" v-if="!initializing">
        <div class="pso-grid-todo__item" v-for="item in todo" :key="item.status_name" @click="handleClick(item)">
          <el-badge :value="item.total" class="item" :hidden="item.total === 0">
            <img :src="getImg(item.status_name)" alt />
          </el-badge>
          <div>{{ item.status_name }}</div>
        </div>
      </div>
      <pso-skeleton v-if="initializing" :lines="3" :s-style="{ padding: '10px' }"></pso-skeleton>
      <div class="pso-grid-latest">
        <span>最新待审</span>
        <el-button size="mini" v-if="curInstance.instance_id" @click="doWf">{{ curInstance.instance_name }}</el-button>
        <div v-else>无</div>
      </div>
    </div>
    <pso-dialog :visible="showExecutor" width="94%" @close="showExecutor = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>{{ curInstance.instance_name }}</span>
            </div>
          </div>
        </div>
      </template>
      <pso-wf-executor ref="executor" :params="executorParams" @excuted="handleExcuted"></pso-wf-executor>
    </pso-dialog>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
export default {
  mixins: [BaseMixin],
  data() {
    return {
      initializing: true,
      todo: [],
      curInstance: {},
      instances: [],
      showExecutor: false,
      customWf: [],
    };
  },
  computed: {
    executorParams() {
      return {
        node_id: this.curInstance.wf_code,
        instance: { instanceId: this.curInstance.instance_id },
      };
    },
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.initializing = true;
      this.customWf = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 14, type: 1 } }) })).data;
      const ret = await this.API.getTodoStat();
      if (ret.success) {
        this.todo = ret.data.nav;
        this.instances = ret.data.data;
        if (this.instances.length) {
          this.curInstance = this.instances[0];
        } else {
          this.curInstance = {};
        }
      }
      this.initializing = false;
    },
    handleClick(status) {
      this.$router.push({ name: "todo", query: { view: status.status_name } });
    },
    handleExcuted() {
      this.fetch();
      this.showExecutor = false;
    },
    getImg(n) {
      return `/static/app/img/review/${n}.png`;
    },
    doWf() {
      const exist = _.find(this.customWf, { map_key1: this.curInstance.wf_code });
      if (exist && exist.map_key2) {
        return window.open(`${exist.map_key2}?insttogo=${instance_id}`);
      }
      this.showExecutor = true;
    },
  },
};
</script>
