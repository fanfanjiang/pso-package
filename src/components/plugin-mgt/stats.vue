<template>
  <div class="stats-mgt">
    <div class="stats-mgt-header">
      <div class="stats-mgt-header__l">
        <el-checkbox v-model="config.paging" true-label="1" false-label="0">分页</el-checkbox>
        <el-checkbox v-model="config.stats" true-label="1" false-label="0">统计</el-checkbox>
      </div>
      <div class="stats-mgt-header__r">
        <el-button size="mini" type="primary" @click="goDesigner">设计脚本</el-button>
        <el-button size="mini" type="primary" @click="showEditor = true">设置动作</el-button>
        <el-button size="mini" type="primary" @click="showCustom = true">自定义参数</el-button>
        <el-button size="mini" type="primary" @click="checkColumn">发布列表</el-button>
        <el-button size="mini" type="primary" @click="makeHeader">发布表头</el-button>
      </div>
    </div>
    <div class="stats-mgt-body">
      <stats-column :column="column" :customizable="false" @save="$emit('save')"></stats-column>
      <div v-if="headerable">
        <stats-header :header="header" :column="column" ref="header"></stats-header>
      </div>
    </div>
    <sql-designer ref="designer" :opener="showDeisgner" :sql="sql" :names="['DATA']"></sql-designer>
    <pso-dialog :visible="showEditor" width="60%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>动作设置</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <action-setter :data="config.actions" :column="column"></action-setter>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showCustom" width="60%" @close="showCustom = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>自定义参数设置</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <stats-column :column="config.conditions" :drillable="false" customizable></stats-column>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { TP_NEW_TYPES, STATIC_COLUMN_FIELDS, STATIC_CONFIG_FIELDS } from "../../const/sys";
import SqlDesigner from "../sql-designer";
import StatsColumn from "./column";
import StatsHeader from "./header";
import { assignList } from "../../utils/util";
import ActionSetter from "./action";
import { formatJSONList } from "../../utils/util";

export default {
  components: { SqlDesigner, StatsColumn, StatsHeader, ActionSetter },
  props: {
    column: Array,
    config: Object,
    node: Object,
    header: Array,
    headerable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    this.TP_NEW_TYPES = TP_NEW_TYPES;
    return {
      showDeisgner: { show: false },
      sql: [],
      oldSql: "",
      showEditor: false,
      showCustom: false,
    };
  },
  created() {
    formatJSONList([this.config], STATIC_CONFIG_FIELDS);

    if (this.node.tp_type === TP_NEW_TYPES[1].value) {
      if (this.node.data_list) {
        try {
          this.sql = JSON.parse(this.node.data_list);
        } catch (error) {
          this.oldSql = this.node.data_list;
        }
      }
    }
    this.$watch("sql", {
      deep: true,
      handler(val) {
        this.node.data_list = JSON.stringify(val);
      },
    });
  },
  methods: {
    async checkColumn() {
      const ret = await this.API.getPluginColumn({ tp_code: this.node.tp_code });
      if (ret.success && ret.data.data) {
        const data = JSON.parse(ret.data.data);
        assignList({
          target: this.column,
          source: data,
          tid: "field",
          sid: "field",
          base: STATIC_COLUMN_FIELDS,
        });
      }
    },
    makeHeader() {
      this.$refs.header.insert(this.column);
    },
    goDesigner() {
      this.showDeisgner.show = true;
      this.$nextTick(() => {
        if (this.oldSql) {
          this.$refs.designer.addSqlBlock({ script: this.oldSql, name: "DATA" });
          this.oldSql = "";
        }
      });
    },
  },
};
</script>
<style lang="less">
.stats-mgt {
  .stats-mgt-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #ecf5ff;
    margin: 10px 0;
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>