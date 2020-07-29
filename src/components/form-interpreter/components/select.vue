<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <template v-if="!reloading">
      <el-select
        size="small"
        v-if="cpnt.data._showType==='select'"
        :disabled="!cpnt.store.editable||cpnt.data._read"
        v-model="cpnt.data._val"
        :placeholder="cpnt.data._placeholder"
      >
        <el-option
          v-for="opt in fixedOptions"
          :key="opt._optionValue"
          :label="opt._fixedName||opt._optionName||opt._optionValue"
          :value="opt._fixedVal||opt._optionValue"
        ></el-option>
      </el-select>
      <el-radio-group size="small" v-else v-model="cpnt.data._val">
        <el-radio
          :label="opt._fixedVal||opt._optionValue"
          :disabled="!cpnt.store.editable||cpnt.data._read"
          v-for="opt in fixedOptions"
          :key="opt._optionValue"
        >{{opt._fixedName||opt._optionName||opt._optionValue}}</el-radio>
      </el-radio-group>
    </template>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import { optionFix } from "../mixins";
export default {
  mixins: [cpntMixin, optionFix]
};
</script>
