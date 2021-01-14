<template>
  <div class="pso-option-input">
    <div class="pso-option-input__l">
      <slot v-if="doInput">
        <el-input :size="size" v-model="data[idField]"></el-input>
      </slot>
      <el-select v-else :size="size" filterable clearable v-model="data[idField]" @clear="clearHandler">
        <el-option v-for="(o, i) in options" :key="i" :label="o[oName] || o[oField]" :value="o[oField]"></el-option>
      </el-select>
    </div>
    <div class="pso-option-input__r" v-if="doInput">
      <el-dropdown size="mini" trigger="click" @command="commandHandler($event)">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="o[oField]" v-for="(o, i) in options" :key="i">{{ o[oName] || o[oField] }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: Object,
    idField: String,
    tField: String,
    options: Array,
    doOptions: {
      type: String,
      default: "1",
    },
    undoOptions: {
      type: String,
      default: "0",
    },
    oField: {
      type: String,
      default: "field",
    },
    oName: {
      type: String,
      default: "name",
    },
    size: {
      type: String,
      default: "mini",
    },
  },
  computed: {
    doInput() {
      return this.data[this.tField] === this.undoOptions;
    },
  },
  methods: {
    commandHandler(command) {
      this.data[this.tField] = this.doOptions;
      this.data[this.idField] = command;
    },
    clearHandler() {
      this.data[this.tField] = this.undoOptions;
      this.data[this.idField] = "";
    },
  },
};
</script>
<style lang="less">
.pso-option-input {
  display: flex;
  align-items: center;
  .pso-option-input__l {
    flex: 1;
  }
  .pso-option-input__r {
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 16px;
      margin-left: 0;
    }
  }
}
</style>