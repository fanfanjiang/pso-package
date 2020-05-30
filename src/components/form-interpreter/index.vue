<template>
  <div class="pso-form">
    <transition name="el-fade-in">
      <el-form v-if="!loading&&store" label-width="80px" label-position="top" size="medium">
        <pso-form-component v-for="cpnt in store.root.childComponents" :key="cpnt.fid" :cpnt="cpnt"></pso-form-component>
      </el-form>
    </transition>
    <pso-skeleton v-if="loading" :lines="10"></pso-skeleton>
  </div>
</template>
<script>
import { CPNT } from "../../const/form";
import PsoFormComponent from "./cpnt";
import FormStore from "../form-designer/model/store.js";
import shortid from "shortid";
import emitter from "../../mixin/emitter";

export default {
  name: "pso-form-interpreter",
  componentName: "PsoformInterpreter",
  components: { PsoFormComponent },
  mixins: [emitter],
  props: {
    formId: String,
    dataId: String,
    dataInstance: Object,
    formEntity: Object,
    editable: {
      type: Boolean, //是否可编辑
      default: true
    }
  },
  data() {
    return {
      loading: false,
      store: null
    };
  },
  watch: {
    formId: {
      immediate: true,
      handler(val) {
        if (val) this.getFormCfg();
      }
    },
    formEntity: {
      immediate: true,
      handler(val) {
        if (val) this.getFormCfg();
      }
    },
    editable(val) {
      if (this.store) this.store.editable = val;
    }
  },
  created() {
    this.isInterpreter = true;
    this.$on("asstable-selected", val => {
      this.broadcast("PsoformItem", "asstable-selected", val);
    });
    this.$on("table-selected", val => {
      this.broadcast("PsoformItem", "table-selected", val);
    });
    this.$on("cpnt-value-changed", val => {
      this.broadcast("PsoformItem", "cpnt-value-changed", val);
      this.$emit("value-change", val);
    });
    this.$on("cpnt-user-changed", val => {
      this.$emit("value-change", val);
    });
    this.$on("cpnt-dept-changed", val => {
      this.$emit("value-change", val);
    });
  },
  methods: {
    async getFormData() {
      this.loading = true;
      if (this.dataInstance) {
        this.store.updateInstance(this.dataInstance);
      } else if (this.dataId) {
        const ret = await this.API.form({ data: { leaf_id: this.dataId, form_code: this.store.data_code } });
        this.store.updateInstance(ret.data);
      } else {
        this.store.updateInstance();
      }
      this.loading = false;
      this.$emit("data-loaded", this.store);
    },
    async getFormCfg() {
      let formCfg;
      //获取表单配置
      if (this.formEntity) {
        this.store = new FormStore(this.formEntity);
      } else if (this.formId) {
        this.loading = true;
        const ret = await this.API.formsCfg({ data: { id: this.formId } });
        this.store = new FormStore(ret.data);
      }
      this.store.editable = this.editable;
      this.$on("dataId", () => {
        this.getFormData();
      });
      this.$on("dataInstance", {
        deep: true,
        handler: () => {
          this.getFormData();
        }
      });
      await this.getFormData();
    },
    async makeData() {
      const cpnts = this.store.cpntsMap;

      //主表数据
      const mainData = { d_status: 0, optype: this.dataId ? 1 : 0 };
      if (this.dataId) {
        mainData.leaf_id = this.dataId;
      }

      //最终组合的数据
      const data = {
        data_name: this.store.data_name,
        node_id: this.store.node_id,
        data_code: this.store.data_code,
        children: [],
        dataArr: [mainData]
      };

      try {
        for (let cpnt of Object.values(cpnts)) {
          const cpntData = cpnt.data;
          if (cpnt.CPNT.host_db && cpntData._val.dataArr.length) {
            data.children.push({
              data_code: cpntData._val.data_code,
              dataArr: cpntData._val.dataArr.filter(subItem => subItem.optype !== 3)
            });
          } else if (cpnt.CPNT.db && !cpnt.parent.CPNT.host_db) {
            //空值检查
            if (cpntData._required && (typeof cpntData._val === "undefined" || cpntData._val === "")) {
              throw new Error(`${cpntData._fieldName}不能为空`);
            }

            //唯一性检查
            if (cpntData._unique) {
              const keys = {};
              if (cpntData.componentid === CPNT.timerange.componentid) {
                // 时间范围组件判重
                keys[cpntData._fieldValue] = { type: 3, value: cpntData._val };

                if (cpntData._relatedField) {
                  cpntData._relatedField.split(",").forEach(fid => {
                    const relateField = cpnts[fid];
                    if (relateField) {
                      keys[relateField.data._fieldValue] = { type: 2, value: relateField.data._val };
                    }
                  });
                }
              } else {
                keys[cpntData._fieldValue] = { type: 2, value: cpntData._val };
              }

              const ret = await this.API.formSearch({
                keys,
                form_code: this.store.data_code,
                limit: 9999999,
                start: 0
              });

              if (ret.data.length) {
                if (ret.data.length === 1 && ret.data[0].leaf_Id === this.dataId) return;
                throw new Error(`${cpntData._fieldName}的数据已存在，不能重复提交，请修改`);
              }
            }

            mainData[cpntData._fieldValue] = cpntData._val;
          }
        }
      } catch (error) {
        this.$message({ message: error.message, type: "warning" });
        throw error;
      }
      return data;
    }
  }
};
</script>
<style lang="less">
@import "../../assets/less/component/form.less";
</style>
<style lang="less" scoped>
@deep: ~">>>";
.pso-form {
  @{deep} {
    .el-date-editor.el-input,
    .el-input-number,
    .el-select,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
}
</style>
