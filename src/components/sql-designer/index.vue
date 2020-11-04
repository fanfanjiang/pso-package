<template>
  <pso-dialog :visible="opener.show" width="100%" @close="opener.show = false">
    <template #title>
      <div class="form-executor-header sql-designer-header">
        <div class="form-executor-header__l">
          <div class="form-executor-title">
            <i class="el-icon-edit-outline"></i>
            <span>设计脚本</span>
          </div>
        </div>
        <div class="sql-designer-header__body">
          <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeSqlBlock">
            <el-tab-pane v-for="(block, i) in sql" :key="i" :label="block.name" :name="block.id"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="form-executor-header__r">
          <div class="sql-designer__add">
            <el-button size="mini" type="success" icon="el-icon-plus" @click="addSqlBlock">新增脚本</el-button>
          </div>
        </div>
      </div>
    </template>
    <div class="sql-designer-wrapper">
      <template v-if="sql && sql.length">
        <transition name="el-fade-in">
          <designer v-if="curBlock" :scode="scode" :block="curBlock"></designer>
        </transition>
      </template>
      <pso-empty v-else text="暂无脚本"></pso-empty>
    </div>
  </pso-dialog>
</template> 
<script>
import shortid from "shortid";
import Designer from "./designer";
export default {
  components: { Designer },
  props: {
    sql: {
      type: Array,
    },
    scode: {
      type: String,
      default: "",
    },
    opener: Object,
  },
  data() {
    return {
      activeTab: "",
    };
  },
  watch: {
    "opener.show"(show) {
      if (show) {
        this.resetActiveTab();
      }
    },
  },
  computed: {
    curBlock() {
      return _.find(this.sql, { id: this.activeTab });
    },
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
        is_index: "0",
        index_script: "",
      });
      this.activeTab = id;
    },
    removeSqlBlock(id) {
      const index = _.findIndex(this.sql, { id });
      if (index !== -1) {
        this.sql.splice(index, 1);
      }
      this.resetActiveTab();
    },
    resetActiveTab() {
      if (this.sql.length) {
        this.activeTab = this.sql[0].id;
      }
    },
  },
};
</script>