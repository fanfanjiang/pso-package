<template>
  <div v-loading="loading">
    <common-panel :cpnt="cpnt" info="以图文的形式展示数据" :needDefaultValue="false">
      <el-form-item label="选择工作表">
        <el-select v-model="cpnt.data._selectedTable" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.data_code"
            :label="item.node_display"
            :value="item.data_code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择标题字段">
        <el-select v-model="cpnt.data._titleField" placeholder="请选择">
          <el-option
            v-for="item in fieldOptions"
            :key="item.fid"
            :label="item._fieldName"
            :value="item._fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择图片字段">
        <el-select v-model="cpnt.data._imgField" placeholder="请选择">
          <el-option
            v-for="item in fieldOptions"
            :key="item.fid"
            :label="item._fieldName"
            :value="item._fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择简介字段">
        <el-select v-model="cpnt.data._infoField" placeholder="请选择">
          <el-option
            v-for="item in fieldOptions"
            :key="item.fid"
            :label="item._fieldName"
            :value="item._fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import FormStore from "../../form-designer/model/store.js";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      loading: false,
      options: [],
      fieldOptions: []
    };
  },
  watch: {
    "cpnt.data._selectedTable"(val) {
      if (val) {
        this.cpnt.data._titleField = "";
        this.cpnt.data._imgField = "";
        this.cpnt.data._infoField = "";
        this.getFormCfg();
      }
    }
  },
  created() {
    this.getFormList();
  },
  methods: {
    async getFormList() {
      this.loading = true;
      this.options = await this.API.getFormTree();
      this.loading = false;
    },
    async getFormCfg() {
      this.loading = true;
      const ret = await this.API.formsCfg({ data: { id: this.cpnt.data._selectedTable }, method: "get" });
      this.loading = false;
      if (!ret.success) return;
      const store = new FormStore(ret.data);
      this.fieldOptions = store.search({
        options: { db: true },
        onlyData: true,
        beforePush: item => !item.parent.CPNT.host_db
      });
    }
  }
};
</script>