<template>
  <div class="pso-form">
    <transition name="el-fade-in">
      <el-form
        v-if="!loading && store"
        :label-width="labelWidth"
        :label-position="labelPosition"
        size="small"
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
import emitter from "../../mixin/emitter";
import { filterByDecimal } from "../../tool/form";

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
      type: Boolean, //是否是复制
      default: false,
    },
    dataDefault: Object,
    mockAsstables: Object,
    hiddenCpnts: Array,
    extendAuth: Array,
    labelPosition: {
      type: String,
      default: "top",
    },
    labelWidth: {
      type: String,
      default: "120px",
    },
    parentInstanceId: {
      type: String,
      default: "",
    },
    ignoreAstColumn: {
      type: Boolean, //忽略关联表在表单设计中设置的列表
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      store: null,
      watchFun: [],
      checkedFormError: false,
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

    //选择不一定_val就会改变
    this.$on("asstable-selected", (val) => {
      this.broadcast("PsoformItem", "asstable-selected", val);
      this.$emit("value-change", val);
    });

    this.$on("cpnt-value-changed", (val) => {
      this.broadcast("PsoformItem", "cpnt-value-changed", val);
      this.$emit("value-change", val);
    });

    this.$on("cpnt-user-initialized", (val) => {
      this.broadcast("PsoformItem", "cpnt-initialized", val);
      this.$emit("value-change", val);
    });

    this.$on("cpnt-dept-initialized", (val) => {
      this.broadcast("PsoformItem", "cpnt-initialized", val);
      this.$emit("value-change", val);
    });

    this.$on("cpnt-tag-initialized", (val) => {
      this.broadcast("PsoformItem", "cpnt-initialized", val);
      this.$emit("value-change", val);
    });

    this.$on("cpnt-asstable-initialized", (val) => {
      this.broadcast("PsoformItem", "cpnt-initialized", val);
      this.broadcast("PsoformItem", "asstable-selected", val);
      this.$emit("value-change", val);
    });

    //专门用在签单中类似用户或者部门的值
    this.$on("cpnt-shownval-done", (val) => {
      this.$emit("shownval-done", val);
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

      if (this.mockAsstables) {
        this.store.mockAsstables = this.mockAsstables;
      }

      //如果是复制模式
      if (this.store.copyMode) {
        this.store.instance_id = "";
      }

      this.$emit("data-loaded", this.store);

      this.$nextTick(() => {
        this.loading = false;
      });
    },
    async getFormCfg() {
      //如果已经监听了，则先停止监听
      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }

      //获取表单配置
      const baseEntity = {
        copyMode: this.copyMode,
        extendAuth: this.extendAuth,
        editable: this.editable,
        parentInstanceId: this.parentInstanceId,
        ignoreAstColumn: this.ignoreAstColumn,
      };

      if (this.formEntity) {
        this.store = new FormStore({ ...this.formEntity, ...baseEntity });
      } else if (this.formId) {
        this.loading = true;
        const ret = await this.API.formsCfg({ data: { id: this.formId } });
        this.store = new FormStore({ ...ret.data, ...baseEntity });
      }

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
    async makeData(__required__ = true) {
      const cpnts = this.store.cpntsMap;

      //主表数据
      const mainData = { optype: this.store.instance_id ? 1 : 0 };

      mainData.leaf_id = this.store.instance_id || this.store.beInstanceId;

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
          if (cpnt.CPNT.host_db) {
            if (cpntData._val.dataArr.length) {
              data.children.push({
                data_code: cpntData._val.data_code,
                dataArr: cpntData._val.dataArr.filter((subItem) => subItem.optype !== 3),
              });
            }
          } else if (cpnt.CPNT.db && !cpnt.parent.CPNT.host_db) {
            //提取关联表中的未提交临时数据，目前只做一层
            //todo:可以处理多次未提交数据，最后递归生成
            if (cpntData.componentid === "asstable") {
              const tempList = [];
              cpntData._proxy.valList.forEach((d) => {
                if (d.__temporary__ && !d.__dump__) {
                  tempList.push(d);
                }
              });
              if (tempList.length) {
                data.children.push({
                  target: cpntData._fieldValue,
                  data_code: cpntData._option,
                  dataArr: tempList,
                });
              }
            }

            if (cpntData.__eventualShow__ && __required__) {
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
            }

            //字段长度检查
            if (cpntData._val && typeof cpntData._fieldLen !== "undefined" && cpntData._fieldType !== "Text") {
              if (!this.checkedFormError) {
                const checkLength = (cpntData._val + "").length;
                if (cpntData._fieldLen < checkLength) {
                  this.checkedFormError = true;
                  throw new Error(
                    `"${cpntData._fieldName}"输入长度(${checkLength})超出预期限制，请先保持当前填写界面（不要关闭或点击保存按钮）并联系管理员修改配置，确认修改后再点击提交或暂存按钮`
                  );
                }
              }
            }

            //唯一性检查
            //20201203：autoid在新增的时候不检查唯一性
            if (cpntData._unique && (cpntData.componentid === "autoid" ? this.store.instance_id : true)) {
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
                if (ret.data.length === 1 && ret.data[0].leaf_id !== this.store.instance_id) {
                  throw new Error(`${cpntData._fieldName}的数据已存在，不能重复提交，请修改`);
                }
              }
            }

            mainData[cpntData._fieldValue] = filterByDecimal(cpnt.data, cpntData._val);
          }
        }
      } catch (error) {
        this.$message({ message: error.message, type: "warning", duration: 30000, showClose: true });
        throw error;
      }
      return data;
    },
  },
};
</script>
