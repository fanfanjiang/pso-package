<template>
  <div class="view-data-fun">
    <template v-if="!hidden">
      <template v-if="opAddable">
        <el-button v-if="!store.addAction" type="primary" size="mini" @click="$emit('new')">{{ store.cpntText.add }}</el-button>
        <action-group v-else :store="store" :actions="[store.addAction]"></action-group>
      </template>
      <el-button v-if="selectable" type="primary" size="mini" @click="$emit('select')">选择</el-button>
      <el-button v-if="wipeable" type="danger" size="mini" @click="$emit('wipe')">清除数据</el-button>
      <slot name="op" v-bind:data="store"></slot>
      <el-button v-if="opAddable && copyable" type="primary" size="mini" @click="store.copyInstance.call(store)" :disabled="disableCopy">
        {{ store.cpntText.copy }}
      </el-button>
    </template>
    <action-group :store="store"></action-group>
    <dropdown
      v-if="opChangable"
      :text="store.cpntText.change"
      :disabled="!store.selectedList.length"
      :options="store.statuses"
      @change="store.changeStatus.call(store, $event)"
    ></dropdown>
    <dropdown
      v-if="opStageable"
      :text="store.cpntText.stage"
      :disabled="!store.selectedList.length"
      :options="store.stages"
      @change="store.changeStage.call(store, $event)"
    ></dropdown>
    <el-dropdown size="small" @command="operateMore" v-if="moreable">
      <el-button class="el-dropdown-link" size="mini" type="text">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="downloadFormTp" v-if="opAddable && tempdownadable">下载模板</el-dropdown-item>
        <el-dropdown-item v-if="opAddable && importable">
          <el-form>
            <pso-form-attach
              :cpnt="uploadAttach"
              :data="{ data_code: store.formCfg.data_code }"
              :preview="false"
              :api="uploadAPI"
              @success="uploadedData"
            >
              <span>导入</span>
            </pso-form-attach>
          </el-form>
        </el-dropdown-item>
        <el-dropdown-item command="exportCurPage" v-if="opExportable">导出EXCEL</el-dropdown-item>
        <el-dropdown-item command="saveColumn">保存列宽</el-dropdown-item>
        <el-dropdown-item command="makeCarbonCopy">
          <pso-picker-user v-if="store.selectedList.length" pattern="checkbox" @confirm="makeCarbonCopy">
            <span style="display: block">抄送</span>
          </pso-picker-user>
          <template v-else> 抄送 </template>
        </el-dropdown-item>
        <el-dropdown-item command="saveFiles" v-if="store.opDownFiles">下载文件</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import Dropdown from "./dropdown";
import PsoFormAttach from "../form-interpreter/components/attachment";
import { genComponentData } from "../form-designer/helper";
import ActionGroup from "./action-group";

export default {
  components: { Dropdown, PsoFormAttach, ActionGroup },
  props: {
    store: Object,
    addable: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    changable: {
      type: Boolean,
      default: true,
    },
    stageable: {
      type: Boolean,
      default: true,
    },
    copyable: {
      type: Boolean,
      default: true,
    },
    moreable: {
      type: Boolean,
      default: true,
    },
    exportable: {
      type: Boolean,
      default: true,
    },
    wipeable: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    tempdownadable: {
      type: Boolean,
      default: false,
    },
    importable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.uploadAPI = "/api/upload/data";
    return {
      uploadAttach: { data: {} },
    };
  },
  computed: {
    opAddable() {
      return this.addable && this.store.opAddable;
    },
    opChangable() {
      return this.changable && this.store.opChangable;
    },
    opStageable() {
      return this.stageable && this.store.opStageable;
    },
    opExportable() {
      return this.exportable && this.store.opExportable;
    },
    disableCopy() {
      return this.store.selectedList.length !== 1;
    },
  },
  created() {
    this.uploadAttach.data = genComponentData({ componentid: "attachment", _fieldName: "", _val: "" });
    this.uploadAttach.data._fieldName = "";
  },
  methods: {
    operateMore(fun) {
      this.store[fun] && this.store[fun]();
    },
    uploadedData() {
      this.store.fetchStatus();
    },
    makeCarbonCopy(users) {
      this.store.makeCarbonCopy(users);
    },
  },
};
</script>