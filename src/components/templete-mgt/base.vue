<template>
  <el-form label-position="left" label-width="80px">
    <el-form-item label="插件名称">
      <el-input size="small" v-model="node.tp_name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="插件类型">
      <el-select size="small" v-model="node.tp_type">
        <el-option v-for="item in TP_TYPES" :key="item.value" :label="item.name" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="插件地址">
      <el-input size="small" v-model="node.tp_route" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="组件">
      <el-input size="small" v-model="node.tp_component" autocomplete="off"></el-input>
    </el-form-item>
    <template v-if="node.tp_type === TP_TYPES[1].value">
      <template v-if="params.__new__">
        <el-form-item label="数据源">
          <el-button size="mini" type="success" @click="goDesigner">设计脚本</el-button>
        </el-form-item>
        <sql-designer ref="designer" :opener="showDeisgner" :sql="sql" :names="['DATA', 'GATHER']"></sql-designer>
      </template>
      <el-form-item label="数据源" v-else>
        <el-input size="small" :rows="8" type="textarea" v-model="node.data_list"></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
import { TP_TYPES } from "../../const/sys";
import SqlDesigner from "../sql-designer";

export default {
  props: ["node", "params"],
  components: { SqlDesigner },
  data() {
    this.TP_TYPES = TP_TYPES;
    return {
      showDeisgner: { show: false },
      sql: [],
      oldSql: "",
    };
  },
  created() {
    if (this.params.__new__) {
      if (this.node.tp_type === TP_TYPES[1].value) {
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
    }
  },
  methods: {
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