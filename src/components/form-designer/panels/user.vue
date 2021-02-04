<template>
  <common-panel :cpnt="cpnt" info="可以选择用户插入表单" :needPlaceholder="true" :needDefaultValue="false">
    <el-form-item label="选择类型">
      <el-radio v-model="cpnt.data._type" label="radio">单选</el-radio>
      <el-radio v-model="cpnt.data._type" label="checkbox">多选</el-radio>
    </el-form-item>
    <el-form-item label="数据源类型">
      <el-radio v-model="cpnt.data._sourceType" label="1">系统数据源</el-radio>
      <el-radio v-model="cpnt.data._sourceType" label="2">表单</el-radio>
    </el-form-item>
    <picker-form
      v-if="cpnt.data._sourceType === '2'"
      :data="cpnt.data"
      form-field="_bindForm"
      :fields="[{ n: '绑定字段', f: '_bindFormField' }]"
    ></picker-form>
    <el-form-item label="默认类型">
      <el-radio v-model="cpnt.data._defaultValType" label="choose">手动选择</el-radio>
      <el-radio v-model="cpnt.data._defaultValType" label="current">当前登录用户</el-radio>
    </el-form-item>
    <el-form-item label="默认值" v-if="!isSetCurrent" v-loading="loading">
      <pso-picker-user :pattern="cpnt.data._type" @confirm="handleAddSelection"></pso-picker-user>
      <div :key="cpnt.fid">
        <el-tag v-for="item in proxy.defaultList" :key="item.user_id" closable @close="handleDelSelection(item)">{{
          item.user_name
        }}</el-tag>
      </div>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";
import { pickerMixin } from "../../../mixin/picker";
import PickerForm from "../../picker/pso-picker-form";

export default {
  props: ["cpnt"],
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "defaultList", typeName: "type" })],
  components: {
    PickerForm,
    commonPanel,
  },
  data() {
    return {
      loading: false,
      proxy: {
        defaultList: [],
        type: this.cpnt.data._type,
      },
    };
  },
  computed: {
    isSetCurrent() {
      return this.cpnt.data._defaultValType === "current";
    },
  },
  watch: {
    "cpnt.data._type": {
      handler(val) {
        this.proxy.type = val;
      },
    },
    "cpnt.data._defaultValType": {
      handler(val) {
        if (val === "current") {
          this.proxy.defaultList = [];
        }
      },
    },
    "proxy.defaultList": {
      deep: true,
      handler(val) {
        this.cpnt.data._defaultValue = val.map((item) => item.user_id).join(",");
      },
    },
  },
  async created() {
    if (!this.isSetCurrent && this.cpnt.data._defaultValue) {
      this.loading = true;
      for (let uid of this.cpnt.data._defaultValue.split(",")) {
        const userRet = await this.getUser(uid);
        if (userRet && userRet.user_id) this.proxy.defaultList.push(userRet);
      }
      this.loading = false;
    }
  },
  methods: {
    async getUser(user_id) {
      return await this.API.user({ data: { user_id }, method: "get" });
    },
  },
};
</script>
