<template>
  <div class="act-section-body">
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" info="添加说明文字"></panel-header>
    <el-form label-position="top" label-width="80px">
      <el-form-item label="说明">
        <el-input v-model="cpnt.data._defaultValue" type="textarea" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import panelHeader from "../common/panel-header";

export default {
  props: ["cpnt"],
  components: {
    panelHeader
  }
};
</script>
