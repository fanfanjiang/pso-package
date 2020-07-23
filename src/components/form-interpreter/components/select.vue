<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-select
      size="small"
      v-if="cpnt.data._showType==='select'"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
    >
      <el-option
        v-for="opt in cpnt.data._option"
        :key="opt._optionValue"
        :label="opt._optionName||opt._optionValue"
        :value="opt._optionValue"
      ></el-option>
    </el-select>
    <el-radio-group size="small" v-else v-model="cpnt.data._val">
      <el-radio
        :label="opt._optionValue||opt._optionName"
        :disabled="!cpnt.store.editable||cpnt.data._read"
        v-for="opt in cpnt.data._option"
        :key="opt._optionValue"
      >{{opt._optionName||opt._optionValue}}</el-radio>
    </el-radio-group>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin]
};
</script>
