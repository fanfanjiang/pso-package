
<template>
  <pso-dialog :visible="opener.show" @close="opener.show = false" width="60%">
    <template #title>
      <div class="form-executor-header sql-designer-header">
        <div class="form-executor-header__l">
          <div class="form-executor-title">
            <i class="el-icon-edit-outline"></i>
            <span>设置参数</span>
          </div>
        </div>
        <div class="form-executor-header__r">
          <div class="sql-designer__add">
            <el-button v-if="stats.statsId" size="mini" type="success" icon="el-icon-plus" @click="addRelation()"> 添加参数 </el-button>
          </div>
        </div>
      </div>
    </template>
    <div style="padding: 15px; overflow: auto; height: 100%" v-if="opener.show">
      <el-form label-width="110px">
        <el-form-item label="选择统计插件">
          <el-select clearable filterable size="mini" v-model="stats.statsId" @change="changeStats">
            <el-option v-for="(o, i) in options" :key="i" :label="o.node_display" :value="o.node_name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-if="stats.statsId && !statsLoading">
        <el-table key="params" :data="stats.relation" style="width: 100%" height="300">
          <el-table-column label="表单字段">
            <template slot-scope="scope">
              <el-select clearable filterable size="mini" v-model="scope.row.s">
                <el-option v-for="(s, i) in sourceFields" :key="i" :label="s.fieldDisplay" :value="s._fieldValue"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="统计字段">
            <template slot-scope="scope">
              <el-select clearable filterable size="mini" v-model="scope.row.t">
                <el-option v-for="(s, i) in statsFields" :key="i" :label="s.name" :value="s.field"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" plain @click="delRelation(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <picker-form v-show="false" form-field="data_code" source="3" :data="formProxy" @loaded="formLoaded"></picker-form>
    </div>
  </pso-dialog>
</template>
<script>
import PickerForm from "../picker/pso-picker-form";
export default {
  components: { PickerForm },
  props: {
    opener: Object,
    stats: Object,
    code: String,
  },
  data() {
    return {
      initializing: true,
      statsLoading: false,
      formProxy: {
        data_code: "",
      },
      sourceFields: [],
      statsFields: [],
      options: [],
    };
  },
  watch: {
    code: {
      handler() {
        this.initialize();
      },
    },
    "opener.show": {
      handler() {
        if (this.stats.statsId) {
          this.changeStats(this.stats.statsId, false);
        }
      },
    },
  },
  async created() {
    const ret = await this.API.trees({ data: { dimen: 4 } });
    this.options = ret.data.tagtree.filter((n) => n.is_leaf && n.tp_type === 1);
    this.initializing = false;
  },
  methods: {
    initialize() {
      if (this.code) {
        this.formProxy.data_code = this.code;
        if (typeof this.stats.statsId === "undefined") {
          this.$set(this.stats, "statsId", "");
        }
        if (typeof this.stats.relation === "undefined") {
          this.$set(this.stats, "relation", []);
        }
      }
    },
    formLoaded({ fields }) {
      this.sourceFields = fields;
    },
    async changeStats(code, refresh = true) {
      if (refresh) {
        this.stats.relation.forEach((d) => (d.t = ""));
      }
      this.statsFields = [];
      const ret = await this.API.getTreeNode({ code });
      if (ret.success) {
        if (ret.data.data.tp_content) {
          this.statsFields = JSON.parse(ret.data.data.tp_content);
        }
      }
    },
    addRelation() {
      this.stats.relation.push({ s: "", t: "" });
    },
    delRelation(index) {
      this.stats.relation.splice(index, 1);
    },
  },
};
</script>