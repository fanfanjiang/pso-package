<template>
  <div class="data-source">
    <div style="text-align: right">
      <el-button size="mini" type="success" @click="showDeisgner.show = true">脚 本</el-button>
      <el-button size="mini" type="success" @click="getColumn" :loading="fetching">生成列表</el-button>
    </div>
    <div style="margin-top: 20px">
      <el-table size="mini" :data="column" style="width: 100%">
        <el-table-column type="index" :index="1" width="40"></el-table-column>
        <el-table-column label="字段" prop="field">
          <template slot-scope="scope">
            {{ scope.row.field }}
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-select filterable size="mini" v-model="scope.row.searchType">
              <el-option v-for="f in FILTER_TYPE_ARY" :key="f.id" :label="f.name" :value="f.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <sql-designer :opener="showDeisgner" :sql="source" :names="['DATA']"></sql-designer>
  </div>
</template>
<script>
import { FILTER_TYPE_ARY } from "../../../share/const/filter";
import SqlDesigner from "../sql-designer";
import { assignList } from "../../utils/util";
export default {
  components: { SqlDesigner },
  props: {
    source: Array,
    column: Array,
    id: String,
  },
  data() {
    this.FILTER_TYPE_ARY = FILTER_TYPE_ARY;
    return {
      fetching: false,
      showDeisgner: { show: false },
    };
  },
  methods: {
    async getColumn() {
      this.fetching = true;
      const ret = await this.API.getPluginModuleColumn({ child_id: this.id });
      if (ret.success && ret.data.data) {
        const data = JSON.parse(ret.data.data);
        assignList({
          target: this.column,
          source: data,
          tid: "field",
          sid: "field",
          base: {
            field: "",
            name: "",
            searchType: "",
          },
        });
      }
      this.fetching = false;
    },
  },
};
</script>