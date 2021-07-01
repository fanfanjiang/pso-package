<template>
  <div style="height: 100%">
    <pso-form-view v-bind="viewOptions" :params="viewOptions" @initialized="onInit">
      <template v-slot:op>
        <el-button size="mini" type="success" @click="onSync()">同步</el-button>
      </template>
      <template v-slot:column="data">
        <el-button size="mini" type="primary" @click="onSetSql(data.data.row)">设计脚本</el-button>
        <el-button size="mini" type="primary" @click="onSave(data.data.row)">保存</el-button>
      </template>
    </pso-form-view>
    <sql-designer :opener="showDeisgner" :outercode="code" :sql="sql"></sql-designer>
  </div>
</template>
<script>
import SqlDesigner from "../sql-designer";
export default {
  components: { SqlDesigner },
  props: {
    params: Object,
  },
  data() {
    return {
      sql: [],
      code: "",
      showDeisgner: { show: false },
      instance: null,
      vStore: null,
    };
  },
  computed: {
    viewOptions() {
      return {
        cfgId: "dataAsync",
        operate: true,
      };
    },
  },
  methods: {
    onInit({ vStore }) {
      this.vStore = vStore;
    },
    onSetSql(data) {
      this.instance = data;
      this.code = data.gl_db ? data.gl_db : "";
      if (data.js_conf) {
        this.sql = JSON.parse(data.js_conf);
      }
      this.showDeisgner.show = true;
    },
    async onSave(data) {
      data.js_conf = JSON.stringify(this.sql);
      this.vStore.addOrUpdate({ leaf_id: data.leaf_id, formData: { data_code: this.vStore.store.data_code, dataArr: [data] } });
    },
    async onSync() {
      if (!this.vStore.selectedList.length) {
        return this.$message({ message: "请选择数据", type: "warning" });
      }
      const ret = await this.API.request("/api/datasync/sync", {
        data: { leafs: _.map(this.vStore.selectedList, "leaf_id").join(",") },
        method: "post",
      });
      this.ResultNotify(ret);
    },
  },
};
</script>