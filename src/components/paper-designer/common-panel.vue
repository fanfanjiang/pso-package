<template>
  <el-form size="mini" label-position="left" label-width="50px" style="padding: 10px">
    <el-form-item label="名称">
      <el-input size="mini" v-model.trim="cpnt.urine.child_name" clearable></el-input>
    </el-form-item>
    <el-form-item label="启用">
      <el-switch size="mini" v-model="cpnt.urine.child_status" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="起始">
      <el-input-number size="mini" v-model="cpnt.data.start" controls-position="right" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="数量">
      <el-input-number size="mini" v-model="cpnt.data.num" controls-position="right" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="分数">
      <el-input-number size="mini" v-model="cpnt.data.score" controls-position="right" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="题干">
      <el-select size="mini" clearable filterable v-model="cpnt.data.stem">
        <el-option v-for="(f, i) in cpnt.urine.child_content" :key="i" :label="f.name || f.field" :value="f.field"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="答案">
      <el-select size="mini" clearable filterable v-model="cpnt.data.answer">
        <el-option v-for="(f, i) in cpnt.urine.child_content" :key="i" :label="f.name || f.field" :value="f.field"></el-option>
      </el-select>
    </el-form-item>
    <slot></slot>
  </el-form>
</template>
<script>
export default {
  props: {
    cpnt: Object,
  },
};
</script>