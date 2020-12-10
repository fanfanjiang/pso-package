<template>
  <div class="wf-designer-update">
    <el-divider content-position="left">更新记录设置</el-divider>
    <el-collapse v-model="activeUpdate">
      <el-collapse-item v-for="(d, k) in node.update" :key="k" :title="`${transType(k).name}时`" :name="k">
        <div class="wf-designer-update__item">
          <el-button size="mini" type="success" @click="goDesigner(k)">设计脚本</el-button>
          <dynamic-updater :source="options" :updater="d"></dynamic-updater>
        </div>
      </el-collapse-item>
    </el-collapse>
    <sql-designer ref="designer" :opener="showDeisgner" :scode="wfDesigner.formStore.data_code" :sql="curSql"></sql-designer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import DynamicUpdater from "../../dynamic-updater";
import { REVIEW_OP_TYPE } from "../../../const/workflow";
import SqlDesigner from "../../sql-designer";

export default {
  components: { DynamicUpdater, SqlDesigner },
  props: ["node"],
  data() {
    this.REVIEW_OP_TYPE_ARY = Object.values(REVIEW_OP_TYPE);
    this.REVIEW_OP_TYPE = REVIEW_OP_TYPE;
    return {
      showDeisgner: { show: false },
      curSql: [],
      activeUpdate: "",
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
    options() {
      return this.wfDesigner.formStore.search({ onlyData: true, options: { db: true } });
    },
  },
  watch: {
    "node.opList": {
      deep: true,
      immediate: true,
      handler() {
        this.prepareUpdate();
      },
    },
  },
  methods: {
    prepareUpdate() {
      if (!this.node.script) {
        this.$set(this.node, "script", {});
      }
      if (Array.isArray(this.node.update)) {
        this.node.update = {};
      }
      for (let OP of this.REVIEW_OP_TYPE_ARY) {
        if (this.node.opList.includes(OP.value)) {
          if (!this.activeUpdate) {
            this.activeUpdate = OP.type;
          }
          this.$set(this.node.update, OP.type, this.node.update[OP.type] || []);
          this.$set(this.node.script, OP.type, this.node.script[OP.type] || []);
        } else {
          this.$delete(this.node.update, OP.type);
          delete this.node.update[OP.type];
          this.$delete(this.node.script, OP.type);
          delete this.node.script[OP.type];
        }
      }
    },
    goDesigner(k) {
      this.curSql = this.node.script[k];
      this.showDeisgner.show = true;
    },
    transType(type) {
      return _.find(this.REVIEW_OP_TYPE_ARY, { type });
    },
  },
};
</script>

