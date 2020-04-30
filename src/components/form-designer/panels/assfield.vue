<template>
  <common-panel :cpnt="cpnt" info="统计关联的记录中的数据。" :needDefaultValue="false">
    <el-form-item label="关联表">
      <el-select v-model="cpnt.data._selectedTable" placeholder="请选择">
        <el-option
          v-for="item in tableOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择字段">
      <el-select v-model="cpnt.data._selectedField" placeholder="请选择">
        <el-option
          v-for="item in fieldOptions"
          :key="item._fieldValue"
          :label="item._fieldName"
          :value="item._fieldValue"
        ></el-option>
      </el-select>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      options: [],
      tableOptionsProxy: [],
      fieldOptionsProxy: []
    };
  },
  computed: {
    tableOptions() {
      this.tableOptionsProxy = this.cpnt.store.search({
        options: { ass_db: true },
        dataOptions: { _type: 1 },
        onlyData: true,
        beforePush: item => !!item.data._option
      });
      return this.tableOptionsProxy;
    },
    fieldOptions() {
      if (this.cpnt.data._selectedTable) {
        const table = this.cpnt.store.search({ options: { fid: this.cpnt.data._selectedTable } });
        if (table) {
          this.fieldOptionsProxy = table.cache.fieldOptions;
        }
      }
      return this.fieldOptionsProxy;
    }
  },
  watch: {
    tableOptionsProxy: {
      deep: true,
      handler(val, oldval) {
        if (this.cpnt.data._selectedTable) {
          const existed = _.find(val, { fid: this.cpnt.data._selectedTable });
          if (!existed) {
            this.cpnt.data._selectedTable = "";
            this.cpnt.data._selectedField = "";
          }
        }
      }
    }
  }
};
</script>