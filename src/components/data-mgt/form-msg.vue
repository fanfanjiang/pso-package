<template>
  <div style="margin-top: 20px">
    <el-form label-position="left" label-width="90px" :inline="true">
      <el-form-item label="消息内容" style="margin-bottom: 10px">
        <el-select size="mini" clearable v-model="data.notify.content">
          <el-option v-for="(d, i) in fields" :key="i" :label="d.field_display" :value="d.field_name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    data: Object,
    fields: Array,
  },
};
</script>