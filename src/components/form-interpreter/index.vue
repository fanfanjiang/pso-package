<template>
  <div class="pso-form">
    <transition name="el-fade-in">
      <el-form
        v-if="!loading&&store"
        label-width="80px"
        label-position="top"
        size="medium"
        v-loading="store.storeLoading"
      >
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
import { FIELD_FORMAT } from "../../const/form";

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
      default: true,
    },
    copyMode: {
      type: Boolean, //是否可编辑
      default: false,
    },
    dataDefault: Object,
  },
  data() {
    return {
      loading: false,
      store: null,
      watchFun: [],
    };
  },
  watch: {
    formId: {
      immediate: true,
      handler(val) {
        if (val) this.getFormCfg();
      },
    },
    formEntity: {
      immediate: true,
      handler(val) {
        if (val) this.getFormCfg();
      },
    },
    editable(val) {
      if (this.store) this.store.editable = val;
    },
  },
  created() {
    this.isInterpreter = true;
    this.$on("asstable-selected", (val) => {
      this.broadcast("PsoformItem", "asstable-selected", val);
    });
    this.$on("table-selected", (val) => {
      this.broadcast("PsoformItem", "table-selected", val);
    });
    this.$on("cpnt-value-changed", (val) => {
      this.broadcast("PsoformItem", "cpnt-value-changed", val);
      this.$emit("value-change", val);
    });
    this.$on("cpnt-user-changed", (val) => {
      this.$emit("value-change", val);
    });
    this.$on("cpnt-dept-changed", (val) => {
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
        this.store.updateInstance(this.dataDefault);
      }
      this.$emit("data-loaded", this.store);
      this.loading = false;
    },
    async getFormCfg() {
      //如果已经监听了，则先停止监听
      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }

      //获取表单配置
      if (this.formEntity) {
        this.store = new FormStore(this.formEntity);
      } else if (this.formId) {
        this.loading = true;
        const ret = await this.API.formsCfg({ data: { id: this.formId } });
        this.store = new FormStore({ copyMode: this.copyMode, ...ret.data });
      }
      this.store.editable = this.editable;

      this.watchFun.push(
        this.$watch("dataId", () => {
          this.getFormData();
        }),
        this.$watch("dataInstance", {
          deep: true,
          handler: () => {
            this.getFormData();
          },
        })
      );

      await this.getFormData();
    },
    async makeData() {
      const cpnts = this.store.cpntsMap;

      //主表数据
      const mainData = { optype: this.store.instance_id ? 1 : 0 };
      if (this.store.instance_id) {
        mainData.leaf_id = this.store.instance_id;
      }

      //最终组合的数据
      const data = {
        data_name: this.store.data_name,
        node_id: this.store.node_id,
        data_code: this.store.data_code,
        children: [],
        dataArr: [mainData],
      };

      try {
        for (let cpnt of Object.values(cpnts)) {
          const cpntData = cpnt.data;
          if (cpnt.CPNT.host_db && cpntData._val.dataArr.length) {
            data.children.push({
              data_code: cpntData._val.data_code,
              dataArr: cpntData._val.dataArr.filter((subItem) => subItem.optype !== 3),
            });
          } else if (cpnt.CPNT.db && !cpnt.parent.CPNT.host_db) {
            //空值检查
            if (cpntData._required && (typeof cpntData._val === "undefined" || cpntData._val === "")) {
              throw new Error(`${cpntData._fieldName}不能为空`);
            }

            //正则检查
            if (cpntData._regular && typeof cpntData._val !== "undefined" && cpntData._val !== "") {
              if (!new RegExp(cpntData._regular).test(cpntData._val)) {
                throw new Error(`${cpntData._fieldName}验证失败`);
              }
            }

            //唯一性检查
            if (cpntData._unique) {
              const keys = {};
              if (cpntData.componentid === CPNT.timerange.componentid) {
                // 时间范围组件判重
                keys[cpntData._fieldValue] = { type: 3, value: cpntData._val };

                if (cpntData._relatedField) {
                  cpntData._relatedField.split(",").forEach((fid) => {
                    const relateField = cpnts[fid];
                    if (relateField) {
                      keys[relateField.data._fieldValue] = { type: 2, value: relateField.data._val };
                    }
                  });
                }
              } else {
                keys[cpntData._fieldValue] = { type: 1, value: cpntData._val };
              }

              const ret = await this.API.form({
                data: { keys: JSON.stringify(keys), data_code: this.store.data_code, limit: 9999999999, page: 0 },
                method: "get",
              });

              if (ret.data.length) {
                if (ret.data.length === 1 && ret.data[0].leaf_Id === this.store.instance_id) return;
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
    },
  },
};
</script>
