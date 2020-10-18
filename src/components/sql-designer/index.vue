<template>
  <div class="sql-designer">
    <div class="sql-designer__add">
      <el-button size="mini" type="success" icon="el-icon-plus" @click="addSqlBlock">新增脚本</el-button>
    </div>
    <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeSqlBlock">
      <el-tab-pane v-for="(block, i) in sql" :key="i" :label="block.name" :name="block.id">
        <sql-item :block="block" :params="params" :params-n="paramsN" :params-v="paramsV"></sql-item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import shortid from "shortid";
import SqlItem from "./sql-item";
export default {
  components: { SqlItem },
  props: {
    sql: {
      type: Array,
    },
    params: Array,
    paramsN: String,
    paramsV: String,
  },
  data() {
    return {
      activeTab: "",
    };
  },
  created() {
    if (this.sql.length) {
      this.activeTab = this.sql[0].id;
    }
  },
  methods: {
    addSqlBlock() {
      const id = shortid.generate();
      this.sql.push({
        id,
        name: "脚本",
        script_type: "0",
        action_type: "0",
        relate_type: "0",
        params: [],
        script: "",
        data_code: "",
        field_config: [],
        optype: "0",
        is_split: "0",
        split_field: "",
      });
      this.activeTab = id;
    },
    removeSqlBlock(id) {
      const index = _.findIndex(this.sql, { id });
      if (index !== -1) {
        this.sql.splice(index, 1);
      }
    },
  },
};
</script>