<template>
  <div>
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" info="表格组件"></panel-header>
    <div class="form-stage-panel__body">
      <el-form :label-position="'top'" label-width="80px">
        <el-form-item label="表格名称">
          <el-input v-model="cpnt.data._fieldName" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  props: ["cpnt"],
  components: {
    panelHeader
  },
  created() {}
};
</script>
<style lang="less" scoped>
</style>