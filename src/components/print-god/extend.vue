<template>
  <div class="cell-extend">
    <el-form style="width: 300px" size="mini" label-position="left" label-width="130px" v-if="extend">
      <el-form-item label="开启扩展">
        <el-switch size="mini" v-model="extend.extendable"> </el-switch>
      </el-form-item>
      <template v-if="extend.extendable">
        <el-form-item label="显示全部选项">
          <el-switch size="mini" v-model="extend.showOpts"> </el-switch>
        </el-form-item>
        <el-form-item label="每行个数" v-if="extend.showOpts">
          <el-input-number :precision="0" :controls="false" size="mini" v-model="extend.optNum"></el-input-number>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    print: Object,
  },
  data() {
    return {};
  },
  computed: {
    extend() {
      return this.print.sheet.curExtend;
    },
  },
  watch: {
    "print.sheet.curCell": {
      immediate: true,
      deep: true,
      handler() {
        this.getExtend();
      },
    },
  },
  methods: {
    getExtend() {
      this.print.sheet.addExtend();
    },
  },
};
</script>
<style lang="less">
.cell-extend {
  width: 300px;
}
</style>