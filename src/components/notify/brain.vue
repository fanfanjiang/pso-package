<template>
  <div v-if="store">
    <el-dialog
      title="消息通知"
      fullscreen
      append-to-body
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="base.notify.show"
    >
      <div class="pso-notify-item" v-if="curNotify">
        <view-item :data="curNotify" :store="store" @read="checkNextNotify"></view-item>
      </div>
    </el-dialog>
    <pso-dialog :visible="store.showExecutor" width="94%" @close="store.showExecutor = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>{{ store.curInstance.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <pso-wf-executor ref="executor" :params="executorParams" @excuted="checkNextNotify(curNotify)"></pso-wf-executor>
    </pso-dialog>
  </div>
</template>
<script>
import Store from "./store";
import ViewItem from "./view-item";
import { mapState } from "vuex";
export default {
  components: { ViewItem },
  data() {
    return {
      curNotify: null,
      store: null,
    };
  },
  computed: {
    ...mapState(["base"]),
    executorParams() {
      return {
        node_id: this.store.curInstance.code,
        instance: { instanceId: this.store.curInstance.instance_id },
      };
    },
  },
  created() {
    if (!this.base.notify.initialized) {
      this.initialize();
    }
  },
  methods: {
    async initialize() {
      this.base.notify.initialized = true;
      this.store = new Store({ $vue: this });
      this.pagination = { limit: 999, start: 0 };
      this.store.unreadable = true;
      const params = { msg_notice: { value: "1", type: 1 } };
      await this.store.fetch(params);

      if (this.store.instances.length) {
        this.curNotify = this.store.instances[0];
        this.base.notify.show = true;
      }
    },
    checkNextNotify(data) {
      const { msg_id } = data;
      const index = _.findIndex(this.store.instances, { msg_id });
      if (index !== -1 && this.store.instances.length - 1 > index) {
        this.curNotify = null;
        this.$nextTick(() => {
          this.curNotify = this.store.instances[index + 1];
        });
      } else {
        this.base.notify.show = false;
      }
    },
  },
};
</script>