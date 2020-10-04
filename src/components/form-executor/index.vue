<template>
  <pso-dialog :title="title" :visible="opener.showExecutor" width="60%" @close="colseHandler">
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
        </div>
        <div class="form-executor-header__r">
          <template v-if="editable && !initializing">
            <el-dropdown size="small" v-if="dataId" trigger="click">
              <span class="el-dropdown-link"> <i class="el-icon-more"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-popconfirm
                    confirmButtonText="确定"
                    cancelButtonText="取消"
                    icon="el-icon-info"
                    iconColor="red"
                    title="你确定要删除吗"
                    @onConfirm="remove"
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
    <div class="form-executor" v-loading="removing">
      <div class="form-executor-body">
        <pso-form-interpreter v-if="showpreter" ref="formImage" v-bind="formParams" @data-loaded="onLoaded"></pso-form-interpreter>
      </div>
      <div class="form-executor-footer" v-if="editable && !initializing">
        <div class="form-executor-footer__l">
          <template v-if="!dataId && keepable">
            <el-checkbox v-model="keepData">继续创建时，保留本次提交内容</el-checkbox>
          </template>
        </div>
        <div class="form-executor-footer__r">
          <template v-if="!dataId">
            <el-button v-if="keepable" size="small" @click="keepSubmitHander" :disabled="saving" :loading="saving"
              >提交并继续创建</el-button
            >
            <el-button type="primary" size="small" @click="submitHandler(true)" :disabled="saving" :loading="saving">提交</el-button>
          </template>
          <template v-else>
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
export default {
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
  },
  data() {
    return {
      initializing: true,
      keepData: false,
      saving: false,
      removing: false,
      showpreter: true,
      store: null,
      data: {},
    };
  },
  computed: {
    formParams() {
      return { ...this.params, ...this.data };
    },
    editable() {
      return this.params.editable !== undefined ? this.params.editable : true;
    },
    dataId() {
      return this.params.dataId;
    },
    showSwitch() {
      return this.dataId && this.instanceids && this.instanceids.length > 1;
    },
    showPrev() {
      return this.showSwitch && this.dataId !== this.instanceids[0];
    },
    showNext() {
      return this.showSwitch && this.dataId !== this.instanceids[this.instanceids.length - 1];
    },
  },
  watch: {
    "params.dataId"() {
      this.initializing = true;
    },
  },
  methods: {
    onLoaded(store) {
      this.store = store;
      this.$emit("data-loaded", store);
      this.initializing = false;
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

        if (this.autoSubmit) {
          if (this.saving) return;

          this.saving = true;
          const ret = await this.API.form({ data: { leaf_id, formData }, method: "put" });
          this.saving = false;

          this.ResultNotify(ret);

          if (ret.success) {
            this.$emit("data-changed", { leaf_id: this.dataId || ret.data.data, formData, op });
            return { ...formData.dataArr[0], leaf_id: "" };
          }
        } else {
          this.$emit("submit", { leaf_id, formData, op });
        }
      }
    },
    async remove() {
      this.removing = true;
      const leaf_id = this.dataId;
      const ret = await this.API.form({
        data: { leaf_id, data_code: this.store.data_code, dataArr: [{ optype: 2, leaf_id }] },
        method: "delete",
      });
      this.removing = false;
      this.ResultNotify(ret);
      if (ret.success) {
        this.$emit("data-changed", { leaf_id, op: 3 });
        this.colseHandler();
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
      this.opener.showExecutor = false;
      this.refresh();
    },
  },
};
</script>