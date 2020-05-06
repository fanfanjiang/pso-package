<template>
  <pso-drawer size="40%" :visible="show" title="表单页面配置" @close="$emit('close')">
    <div class="pso-formtable-setting">
      <div class="pso-fts-section">
        <div class="pso-fts-section__title">页面名称</div>
        <el-input v-model="tp_name"></el-input>
      </div>
      <div class="pso-fts-section">
        <div class="pso-fts-section__title">选择数据表</div>
        <el-cascader
          :props="formTreeSetting"
          v-model="formNodeId"
          :options="formOptions"
          @change="handleFormChange"
        ></el-cascader>
      </div>
      <div class="pso-fts-section">
        <div class="pso-fts-section__title">显示列</div>
        <el-collapse>
          <el-collapse-item :title="showFieldsCount">
            <div class="pso-fts-showfields" v-for="fItem of showFields" :key="fItem.value">
              <el-switch v-model="fItem.show" :active-text="fItem.name"></el-switch>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="pso-fts-section">
        <div class="pso-fts-section__title">筛选数据</div>
        <pso-datafilter
          v-if="formNodeId"
          v-model="condition"
          :condition="conditionMap"
          :fieldsOptions="conditionOptions"
        ></pso-datafilter>
      </div>
    </div>
    <template v-slot:footer>
      <div class="pso-drawer-footer__body">
        <el-button type="primary" size="small" @click="save">确认</el-button>
      </div>
    </template>
  </pso-drawer>
</template>
<script>
import PsoDatafilter from "../data-filter/index";
import { listToTree } from "../../utils/util";
import FormStore from "../form-designer/model/store.js";

export default {
  components: { PsoDatafilter },
  props: {
    cfgId: String,
    appid: String,
    show: Boolean,
    params: Object,
    data: Object
  },
  data() {
    return {
      store: {},
      formNodeId: "",
      formTreeSetting: {
        value: "node_id",
        label: "node_display"
      },
      formOptions: [],
      condition: "",
      conditionMap: [],
      conditionOptions: [],
      showFields: [],
      tp_name: ""
    };
  },
  computed: {
    showFieldsCount() {
      return `显示 ${this.showFields.filter(f => !!f.show).length} 列`;
    }
  },
  created() {
    this.loadFormTree();
    this.getCfg();
  },
  watch: {
    formNodeId(val) {
      if (val) this.getFormCfg();
    },
    data() {
      this.getCfg();
    }
  },
  methods: {
    async getCfg() {
      let tpSet;
      if (!this.formOptions.length) await this.loadFormTree();
      if (this.data) {
        tpSet = this.data;
      } else if (this.cfgId) {
        const ret = await this.API.templates({ data: { tp_type: "103", tp_code: this.cfgId } });
        tpSet = JSON.parse(ret.data.tp_set);
      }
      if (tpSet) {
        this.formNodeId = tpSet.formId || "";
        this.showFields = tpSet.showFields || [];
        this.condition = tpSet.condition || "";
      }
    },
    async loadFormTree() {
      let ret = await this.API.trees({ data: { node_id: this.appid, node_dimen: "nodedimen03" } });
      let tree = listToTree({
        list: ret.data,
        pid: "node_pid",
        id: "node_id"
      });
      this.formOptions = tree[0].children || [];
    },
    async getFormCfg() {
      let ret = await this.API.formsCfg({ data: { id: this.formNodeId }, method: "get" });
      if (!ret.success) return;
      this.store = new FormStore(ret.data);
      this.conditionOptions = this.store.search({ options: { db: true }, onlyData: true, beforePush: item => !item.parent.CPNT.host_db });
      this.showFields = this.store
        .search({
          options: { table_show: true },
          onlyData: true,
          beforePush: item => !item.parent.CPNT.host_db
        })
        .map(f => ({ name: f._fieldName, value: f._fieldValue, show: true }));
    },
    async save() {
      let ret = await this.API.templates({
        data: {
          tp_code: this.params.tpCode,
          tp_type: this.params.tpType,
          tp_status: 1,
          tp_name: this.tp_name,
          tp_data: "1",
          tp_set: JSON.stringify({
            formId: this.formNodeId,
            showFields: this.showFields,
            condition: this.condition
          })
        },
        method: "put"
      });
      this.$emit("close");
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";

.pso-formtable-setting {
  padding: 15px;
  background-color: #fff;
  .pso-fts-section {
    padding-bottom: 20px;
    border-bottom: 1px solid #f5f3f3;
    margin-bottom: 20px;
    .pso-fts-section__title {
      margin-bottom: 12px;
      padding-left: 15px;
      position: relative;
      color: #999;
      &::after {
        content: "";
        height: 100%;
        width: 5px;
        left: 0;
        top: 0;
        position: absolute;
        background-color: #f0883c;
      }
    }
  }
  .pso-fts-showfields {
    margin-bottom: 5px;
  }

  @{deep} {
    .el-collapse-item__header {
      font-size: 14px;
    }
    .el-collapse-item__header,
    .el-collapse-item__wrap {
      border-bottom: none;
    }
  }
}
.pso-drawer-footer__body {
  padding: 10px;
}
</style>
