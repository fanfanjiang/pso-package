<template>
  <div class="view-data-fun">
    <el-button v-if="opAddable" type="primary" size="mini" @click="$emit('new')">{{ store.cpntText.add }}</el-button>
    <el-button v-if="selectable" type="primary" size="mini" @click="$emit('select')">选择</el-button>
    <slot name="op"></slot>
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
    <el-button v-if="opAddable && copyable" type="primary" size="mini" @click="store.copyInstance.call(store)" :disabled="disableCopy">
      {{ store.cpntText.copy }}
    </el-button>
    <el-dropdown size="small" @command="operateMore" v-if="moreable">
      <el-button class="el-dropdown-link" size="mini" type="text">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="downloadFormTp">下载模板</el-dropdown-item>
        <el-dropdown-item v-if="opAddable">
          <el-form>
            <pso-form-attach :cpnt="uploadAttach" :data="{ data_code: store.formCfg.data_code }" :preview="false" :api="uploadAPI">
              <span>导入</span>
            </pso-form-attach>
          </el-form>
        </el-dropdown-item>
        <el-dropdown-item command="exportCurPage" v-if="opExportable">导出EXCEL</el-dropdown-item>
        <el-dropdown-item v-if="opExportable">全部导出</el-dropdown-item>
        <el-dropdown-item command="saveColumn" v-if="opAddable">保存列宽</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import Dropdown from "./dropdown";
import PsoFormAttach from "../form-interpreter/components/attachment";
import { genComponentData } from "../form-designer/helper";

export default {
  components: { Dropdown, PsoFormAttach },
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
  },
  data() {
    this.uploadAPI = "/api/upload/data";
    return {
      uploadAttach: { data: {} },
    };
  },
  computed: {
    opAddable() {
      return this.addable && (this.store.opAuth & 1) === 1;
    },
    opChangable() {
      return this.changable && this.store.statuses.length && (this.store.opAuth & 2) === 2;
    },
    opStageable() {
      return this.stageable && this.store.stages.length && (this.store.opAuth & 8) === 8;
    },
    opExportable() {
      return this.exportable && (this.store.opAuth & 4) === 4;
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
  },
};
</script>