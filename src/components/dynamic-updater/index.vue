<template>
  <div class="dynamic-updater">
    <div class="dynamic-updater-item" v-for="(d, i) in updater" :key="i">
      <div class="dynamic-updater-item__source">
        <div class="dynamic-updater-item__title">将字段</div>
        <div class="dynamic-updater-item__source-body">
          <upoptions key="source" :clearable="false" :data="d" :options="cpnts" field="source" @change="sourceChangeHandler(d)"></upoptions>
          <i class="dynamic-updater-item__del el-icon-delete-solid" @click="delUpdater(i)"></i>
        </div>
      </div>
      <div class="dynamic-updater-item__target" v-if="d.source">
        <div class="dynamic-updater-item__title">设置为</div>
        <div class="dynamic-updater-item__target-custom" v-if="d.type === 1">
          <div class="dynamic-updater-item__target-custom-l">
            <cpnt v-if="showCpnt" :data="getCpnt(d.source)" v-model="d.target"></cpnt>
          </div>
          <div class="dynamic-updater-item__target-custom-r">
            <el-dropdown size="mini" trigger="click" @command="commandHandler($event, d)">
              <span class="el-dropdown-link">
                <i class="el-icon-plus el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="o._fieldValue" v-for="(o, i) in cpnts" :key="i">{{ o._fieldName }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="dynamic-updater-item__target-slef" v-else>
          <upoptions key="target" :data="d" :options="cpnts" field="target" @clear="selfChangeHandler(d)"></upoptions>
        </div>
      </div>
    </div>
    <div class="dynamic-updater__add">
      <el-button icon="el-icon-plus" plain size="mini" @click="addUpdater">添加字段</el-button>
    </div>
  </div>
</template>
<script>
import cpnt from "../dynamic-filter/cpnt";
import Upoptions from "./options";
import { makeSysFormFields } from "../../tool/form";

export default {
  components: { cpnt, Upoptions },
  props: {
    source: Array,
    updater: Array,
    sysable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cpnts: [],
      showCpnt: true,
    };
  },
  created() {
    this.cpnts = this.sysable ? this.source.concat(makeSysFormFields()) : this.source;
  },
  methods: {
    addUpdater() {
      this.updater.push({ type: 1, op: 1, source: "", target: "" });
    },
    delUpdater(index) {
      this.updater.splice(index, 1);
    },
    getCpnt(_fieldValue) {
      return _.find(this.cpnts, { _fieldValue });
    },
    sourceChangeHandler(data) {
      this.showCpnt = false;
      data.target = "";
      this.$nextTick(() => (this.showCpnt = true));
    },
    commandHandler(command, data) {
      data.type = 2;
      data.target = command;
    },
    selfChangeHandler(data) {
      data.type = 1;
      data.target = "";
    },
  },
};
</script>