<template>
  <div class="cell-extend">
    <el-form style="width: 300px" size="mini" label-position="left" label-width="130px">
      <el-form-item label="固定模式">
        <el-switch size="mini" v-model="print.sheet.config.fixCell"> </el-switch>
      </el-form-item>
      <template v-if="extend">
        <el-form-item label="开启扩展">
          <el-switch size="mini" v-model="extend.extendable"> </el-switch>
        </el-form-item>
        <template v-if="extend.extendable">
          <el-form-item label="选择类字段显示全部选项">
            <el-switch size="mini" v-model="extend.showOpts"> </el-switch>
          </el-form-item>
          <el-form-item label="每行选项显示个数" v-if="extend.showOpts">
            <el-input-number :precision="0" :controls="false" size="mini" v-model="extend.optNum"></el-input-number>
          </el-form-item>
          <el-form-item label="选择类字段扩展显示">
            <el-select size="mini" v-model="extend.esymble">
              <el-option label="☑" value="1"></el-option>
              <el-option label="()" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扩展显示位置">
            <el-select size="mini" v-model="extend.ePosition">
              <el-option label="左" value="1"></el-option>
              <el-option label="右" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期转换格式">
            <el-input size="mini" v-model="extend.format"></el-input>
          </el-form-item>
        </template>
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