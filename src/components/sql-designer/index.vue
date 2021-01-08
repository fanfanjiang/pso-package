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
            <el-button size="mini" type="success" icon="el-icon-plus" @click="addSqlBlock()">新增脚本</el-button>
            <el-checkbox v-model="message">消息</el-checkbox>
          </div>
        </div>
      </div>
    </template>
    <div class="sql-designer-wrapper">
      <template v-if="sql && sql.length">
        <transition name="el-fade-in">
          <designer v-if="curBlock" :scode="scode" :block="curBlock" :names="names" :msg-mains="msgMains" :msg-subs="msgSubs"></designer>
        </transition>
      </template>
      <pso-empty v-else text="暂无脚本"></pso-empty>
    </div>
  </pso-dialog>
</template> 
<script>
import shortid from "shortid";
import Designer from "./designer";
import { formatJSONList } from "../../utils/util";
import { SQL_FEILDS } from "../../const/sys";

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
    names: Array,
  },
  data() {
    return {
      activeTab: "",
      curBlock: null,
      message: false,
      msgMains: [],
      msgSubs: [],
    };
  },
  watch: {
    "opener.show"(show) {
      if (show) {
        this.initialize();
      }
    },
    activeTab() {
      this.setCurBlock();
    },
    message() {
      this.checkMessage();
    },
  },
  methods: {
    async initialize() {
      formatJSONList(this.sql, SQL_FEILDS);
      this.resetActiveTab();
      this.message = !!this.getMsgBlock();
      
      const data = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: "9,10", type: 4 } }) })).data;
      const grouped = _.groupBy(data, "config_type");
      if (grouped["9"]) {
        this.msgMains = grouped["9"];
      }
      if (grouped["10"]) {
        this.msgSubs = grouped["10"];
      }
    },
    addSqlBlock(option = {}) {
      let { name } = option;

      if (!name) {
        if (this.names) {
          name = this.names[0];
        } else {
          name = "脚本";
        }
      }

      const id = shortid.generate();
      const data = {
        ..._.cloneDeep(SQL_FEILDS),
        ...option,
        id,
        name,
        scode: this.scode,
      };

      const msgIndex = _.findIndex(this.sql, { is_msg: "1" });
      if (msgIndex !== -1) {
        this.sql.splice(msgIndex, 0, data);
      } else {
        this.sql.push(data);
      }

      this.activeTab = id;
    },
    removeSqlBlock(id) {
      const index = _.findIndex(this.sql, { id });
      if (index !== -1) {
        if (this.sql[index].is_msg === "1") this.message = false;
        this.sql.splice(index, 1);
      }
      this.resetActiveTab();
    },
    resetActiveTab() {
      if (this.sql.length) {
        this.activeTab = this.sql[0].id;
      }
    },
    setCurBlock() {
      if (this.activeTab) {
        this.curBlock = null;
        this.$nextTick(() => {
          this.curBlock = _.find(this.sql, { id: this.activeTab });
        });
      } else {
        this.curBlock = null;
      }
    },
    getMsgBlock() {
      return _.find(this.sql, { is_msg: "1" });
    },
    checkMessage() {
      const msg = _.find(this.sql, { is_msg: "1" });
      if (this.message) {
        !msg && this.addSqlBlock({ is_msg: "1", name: "消息", script_type: "1", action_type: "1" });
      } else {
        msg && this.removeSqlBlock(msg.id);
      }
    },
  },
};
</script>