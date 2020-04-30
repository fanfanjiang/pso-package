<template>
  <div class="form-stage-panel">
    <panel-header :name="cpnt.store.data_name"></panel-header>
    <div class="form-stage-panel__body">
      <el-form :label-position="'top'" label-width="80px">
        <el-form-item label="表单名称">
          <el-input v-model="cpnt.store.data_name" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  components: { panelHeader },
  props: ["cpnt"]
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";
@{deep}.el-form-item__label {
  line-height: 20px;
  color: #000;
}
</style>