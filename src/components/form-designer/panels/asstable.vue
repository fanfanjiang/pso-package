<template>
  <div>
    <common-panel :cpnt="cpnt" info="关联相关工作表，可以从中引用或创建记录，如：订单关联商品" :needDefaultValue="false">
      <el-form-item label="选择工作表" v-loading="loading">
        <el-select
          v-model="cpnt.data._option"
          filterable
          placeholder="请选择"
          @change="formChangeHandler"
        >
          <el-option
            v-for="item in options"
            :key="item.node_id"
            :label="item.node_name"
            :value="item.node_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联方式">
        <el-radio v-model="cpnt.data._type" :label="1">单条</el-radio>
        <el-radio v-model="cpnt.data._type" :label="2">多条</el-radio>
      </el-form-item>
      <el-form-item label="选择显示字段" v-loading="loading">
        <el-select multiple v-model="showFields" placeholder="请选择" :key="cpnt.fid">
          <el-option
            v-for="item in cpnt.cache.fieldOptions"
            :key="item._fieldValue"
            :label="item._fieldName"
            :value="item._fieldValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <form-asstable
        :key="cpnt.fid"
        v-if="cpnt.cache.defaultEl._option"
        :cpnt="{data:cpnt.cache.defaultEl}"
      ></form-asstable>
      <el-form-item label="设置">
        <div class="act-panel_check">
          <el-checkbox v-model="cpnt.data._new" :true-label="true" :false-label="false">允许新增关联数据</el-checkbox>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">允许新增关联数据</div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
        <div class="act-panel_check">
          <el-checkbox v-model="cpnt.data._relate" :true-label="true" :false-label="false">允许关联已有数据</el-checkbox>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">允许关联已有数据</div>
            <i class="tip el-icon-question"></i>
          </el-tooltip>
        </div>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import FormAsstable from "@/components/form-interpreter/components/asstable";
import { genComponentData } from "../helper";
import FormStore from "@/components/form-designer/model/store.js";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    FormAsstable
  },
  data() {
    return {
      options: [],
      loading: false
    };
  },
  computed: {
    showFields: {
      get() {
        return !this.cpnt.data._showFields ? [] : this.cpnt.data._showFields.split(",");
      },
      set(val) {
        this.cpnt.data._showFields = val.join(",");
      }
    }
  },
  watch: {
    "cpnt.data._type"(type) {
      this.cpnt.cache.defaultEl._type = type;
    }
  },
  created() {
    this.getFormList();
    this.setCache();
    if (this.cpnt.data._option) this.formChangeHandler(this.cpnt.data._option);
  },
  beforeUpdate() {
    this.setCache();
  },
  methods: {
    setCache() {
      if (!this.cpnt.cache.defaultEl) {
        this.$set(this.cpnt.cache, "fieldOptions", []);

        this.$set(
          this.cpnt.cache,
          "defaultEl",
          genComponentData({
            componentid: this.cpnt.componentid,
            _type: this.cpnt.data._type,
            _option: this.cpnt.data._option,
            _fieldName: "设置默认关联",
            _required: false,
            _val: "",
            _relate: this.cpnt.data._relate,
            _new: this.cpnt.data._new
          })
        );

        this.$watch(`cpnt.cache.defaultEl._val`, val => {
          this.cpnt.data._defaultValue = val;
        });

        this.$watch(`cpnt.data._relate`, val => {
          this.cpnt.cache.defaultEl._relate = val;
        });

        this.$watch(`cpnt.data._new`, val => {
          this.cpnt.cache.defaultEl._new = val;
        });
      }
    },
    async getFormList() {
      this.loading = true;

      const ret = await this.API.trees({
        data: { node_id: this.cpnt.store.appid, appid: this.cpnt.store.appid, node_dimen: "nodedimen03" }
      });
      this.options = ret.data.filter(node => node.data_type === "form" && node.is_leaf);

      this.loading = false;
    },
    async formChangeHandler(id) {
      this.loading = true;

      this.cpnt.cache.defaultEl._option = "";
      this.cpnt.data._showFields = "";

      const ret = await this.API.formsCfg({ data: { id }, method: "get" });

      const store = new FormStore(ret.data);

      this.cpnt.cache.fieldOptions = store.search({
        options: { table_show: true },
        onlyData: true,
        beforePush: item => !item.parent.CPNT.host_db
      });

      this.cpnt.cache.defaultEl._option = id;

      this.cpnt.data._showFields = _.map(this.cpnt.cache.fieldOptions, "_fieldValue").join(",");
      this.loading = false;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.act-panel_check {
  .tip {
    margin-left: 5px;
    color: #999;
  }
}
@{deep} {
  .el-form-item__label {
    line-height: 20px;
    color: #000;
  }
  .el-select {
    width: 100%;
  }
}
</style>