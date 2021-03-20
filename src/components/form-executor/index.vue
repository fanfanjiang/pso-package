<template>
  <pso-dialog :title="title" :visible="opener.showExecutor" :width="boxWidth" @close="colseHandler">
    <template #title>
      <div class="form-executor-header" v-loading="initializing">
        <div class="form-executor-header__l">
          <div class="form-executor-title">
            <i class="el-icon-edit-outline"></i>
            <span>{{ title }}</span>
          </div>
          <div class="form-executor-switch" v-if="showSwitch">
            <el-tooltip content="上一条记录" placement="top-start" :visible-arrow="false" :open-delay="500" :hide-after="2000">
              <el-button :disabled="!showPrev" @click="$emit('prev')" size="medium" type="text" icon="el-icon-arrow-up"></el-button>
            </el-tooltip>
            <el-tooltip content="下一条记录" placement="top-start" :visible-arrow="false" :open-delay="500" :hide-after="2000">
              <el-button :disabled="!showNext" @click="$emit('next')" size="medium" type="text" icon="el-icon-arrow-down"></el-button>
            </el-tooltip>
          </div>
          <el-tooltip content="全屏" placement="top-start" :visible-arrow="false" :open-delay="500" :hide-after="2000">
            <el-button
              v-if="!__isMobile__"
              style="margin-left: 20px"
              @click="fullScreen = !fullScreen"
              size="medium"
              type="text"
              icon="el-icon-full-screen"
            ></el-button>
          </el-tooltip>
        </div>
        <div class="form-executor-header__r">
          <template v-if="!initializing">
            <el-popconfirm
              confirmButtonText="确定"
              cancelButtonText="取消"
              icon="el-icon-info"
              iconColor="red"
              title="你确定要删除这条数据吗？"
              @confirm="remove"
            >
              <el-button slot="reference" v-if="deletable && !__isMobile__" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
            <el-dropdown size="small" trigger="click" @command="moreCommandhandler">
              <span class="el-dropdown-link"> <i class="el-icon-more"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="print" v-if="dataId">打印 </el-dropdown-item>
                <el-dropdown-item v-if="deletable && __isMobile__">
                  <el-popconfirm
                    confirmButtonText="确定"
                    cancelButtonText="取消"
                    icon="el-icon-info"
                    iconColor="red"
                    title="你确定要删除这条数据吗？"
                    @confirm="remove"
                  >
                    <span slot="reference">删除</span>
                  </el-popconfirm>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </div>
      </div>
    </template>
    <div class="form-executor" ref="executor" v-loading="removing">
      <div class="form-executor-body">
        <pso-form-interpreter v-if="showpreter" ref="formImage" v-bind="formParams" @data-loaded="onLoaded"></pso-form-interpreter>
      </div>
      <div class="form-executor-footer" v-if="(editable || addable) && !initializing">
        <div class="form-executor-footer__l" v-if="addable && keepable">
          <el-checkbox v-model="keepData">继续创建时，保留本次提交内容</el-checkbox>
        </div>
        <div class="form-executor-footer__r">
          <template v-if="addable">
            <el-button v-if="keepable" size="small" @click="keepSubmitHander" :disabled="saving" :loading="saving">
              保存并继续创建
            </el-button>
            <el-button type="primary" size="small" @click="submitHandler(true)" :disabled="saving" :loading="saving">保存</el-button>
          </template>
          <template v-if="dataId">
            <el-button size="small" @click="submitHandler(false)" :disabled="saving" :loading="saving">保存</el-button>
            <el-button type="primary" size="small" @click="submitHandler(true)" :disabled="saving" :loading="saving">保存并退出</el-button>
          </template>
        </div>
      </div>
    </div>
  </pso-dialog>
</template>
<script>
import shortid from "shortid";
import { imitateFormData } from "../../tool/form";
import { QuickInput } from "../../mixin/form";

export default {
  mixins: [QuickInput],
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    title: String,
    opener: Object,
    autoSubmit: {
      type: Boolean,
      default: true,
    },
    instanceids: {
      type: Array,
    },
    keepable: {
      type: Boolean,
      default: true,
    },
    switchable: {
      type: Boolean,
      default: true,
    },
    befSaveFunc: Function,
  },
  data() {
    return {
      initializing: true,
      keepData: false,
      saving: false,
      removing: false,
      showpreter: true,
      store: null,
      fullScreen: false,
      data: {},
      originData: null,
    };
  },
  computed: {
    formParams() {
      return { ...this.params, ...this.data, editable: this.addable || this.editable };
    },
    dataId() {
      return this.params.dataId;
    },
    editable() {
      return this.params.editable !== undefined ? this.params.editable : true;
    },
    addable() {
      return (this.params.addable !== undefined ? this.params.addable : this.editable) && !this.dataId;
    },
    deletable() {
      return (this.params.deletable !== undefined ? this.params.deletable : this.editable) && this.dataId;
    },
    showSwitch() {
      return this.switchable && this.dataId && this.instanceids && this.instanceids.length > 1;
    },
    showPrev() {
      return this.showSwitch && this.dataId !== this.instanceids[0];
    },
    showNext() {
      return this.showSwitch && this.dataId !== this.instanceids[this.instanceids.length - 1];
    },
    isTemporary() {
      //暂存的数据，还没有真实提交
      return this.formParams.dataInstance && this.formParams.dataInstance.__temporary__;
    },
    isDump() {
      //暂存的数据，还没有真实提交
      return this.formParams.dataInstance && this.formParams.dataInstance.__dump__;
    },
    boxWidth() {
      return this.fullScreen ? "100%" : "70%";
    },
  },
  watch: {
    "params.dataId"(value) {
      this.initializing = true;

      //保存原始数据
      if (this.params.dataInstance) {
        this.originData = _.cloneDeep(this.params.dataInstance);
      } else {
        this.originData = null;
      }
    },
  },
  methods: {
    onLoaded(store) {
      this.store = store;
      this.$emit("data-loaded", store);
      this.initializing = false;
      this.$nextTick(() => {
        this.initKeyevent(store);
      });
    },
    async keepSubmitHander() {
      const data = await this.addOrUpdate();
      if (data) {
        this.showpreter = false;
        if (this.keepData) {
          this.$set(this.data, "dataInstance", data);
        } else {
          this.clearCopy();
        }
        this.$nextTick(() => {
          this.showpreter = true;
        });
      }
    },
    async submitHandler(close) {
      const data = await this.addOrUpdate();
      if (data && close) {
        this.colseHandler();
      }
    },
    async makeData() {
      try {
        return await this.$refs.formImage.makeData();
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async addOrUpdate() {
      const formData = await this.makeData();
      if (formData) {
        const leaf_id = this.dataId || shortid.generate();
        const op = this.dataId ? 2 : 1;

        const afterChange = (trueId = "") => {
          if (this.isTemporary) {
            formData.dataArr[0]["__temporary__"] = true;
            formData.dataArr[0]["__dump__"] = this.isDump;

            try {
              //判断数据是否有改变
              if (this.originData) {
                for (let key in formData.dataArr[0]) {
                  const sv = this.originData[key];
                  const tv = formData.dataArr[0][key];
                  if (key !== "optype" && tv != sv && !(tv === "" && typeof sv === "undefined")) {
                    formData.dataArr[0]["__dump__"] = false;
                    break;
                  }
                }
              }
            } catch (error) {
              console.log(error);
            }

            imitateFormData(formData.dataArr[0], this.store);
          }
          this.$emit("data-changed", { leaf_id: this.dataId || trueId, formData, op });
          return { ...formData.dataArr[0], leaf_id: "" };
        };

        if (this.autoSubmit && !this.isTemporary) {
          if (this.saving) return;
          this.saving = true;

          const befRet = await this.beforeSaveHandler({ leaf_id, formData, op });
          if (!befRet) {
            return (this.saving = false);
          }

          const ret = await this.API.form({ data: { leaf_id, formData }, method: "put" });
          this.saving = false;
          this.ResultNotify(ret);
          if (ret.success) {
            return afterChange(ret.data.data);
          }
        } else {
          return afterChange(leaf_id);
        }
      }
    },
    async beforeSaveHandler(data) {
      if (this.params.befSaveFunc) {
        return await this.params.befSaveFunc(data);
      }
      return true;
    },
    async remove() {
      const leaf_id = this.dataId;

      const afterRemove = () => {
        this.$emit("data-changed", { leaf_id, op: 3 });
        this.colseHandler();
      };

      if (!this.isTemporary) {
        this.removing = true;

        const ret = await this.API.form({
          data: { leaf_id, data_code: this.store.data_code, dataArr: [{ optype: 2, leaf_id }] },
          method: "delete",
        });
        this.removing = false;
        this.ResultNotify(ret);
        if (ret.success) {
          afterRemove();
        }
      } else {
        afterRemove();
      }
    },
    clearCopy() {
      this.$delete(this.data, "dataInstance");
      delete this.data.dataInstance;
    },
    refresh() {
      this.clearCopy();
      this.initializing = true;
    },
    colseHandler() {
      this.clearKeyevent();
      this.opener.showExecutor = false;
      this.refresh();
    },
    moreCommandhandler(command) {
      if (command === "print") {
        window.open(`/printer/${this.store.data_code}/${this.dataId}`, "_blank");
      }
    },
  },
};
</script>