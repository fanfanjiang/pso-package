<template>
  <div class="printgod-designer-menubody" v-if="print">
    <el-dropdown @command="familyHandler" trigger="click">
      <span class="el-dropdown-link">{{ fontFamily }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(d, i) in _CONST.FONT_FAMILY" :key="i" :command="d.v">{{ d.n }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import _CONST from "./const";
export default {
  props: {
    print: Object,
  },
  data() {
    this._CONST = _CONST;
    return {};
  },
  computed: {
    fontFamily() {
      return _.find(_CONST.FONT_FAMILY, { v: this.print.menu.fontFamily }).n;
    },
  },
  methods: {
    familyHandler(command) {
      this.store.setFontFamilyCls(command);
    },
  },
};
</script>
<style lang="less">
.printgod-designer-menubody {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>