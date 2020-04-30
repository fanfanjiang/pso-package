<template>
  <div class="act-section-body">
    <panel-header :icon="cpnt.CPNT.icon" :name="cpnt.CPNT.name" info="分段"></panel-header>
    <el-form label-position="top" label-width="80px">
      <el-form-item label="分段文字">
        <el-input v-model="cpnt.data._defaultValue" clearable></el-input>
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
