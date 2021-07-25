<template>
  <pso-label :cpnt="cpnt">
    <template v-if="!reloading">
      <el-select
        :size="size"
        v-if="cpnt.data._showType === 'select'"
        :disabled="!cpntEditable"
        v-model="cpnt.data._val"
        filterable
        clearable
        :placeholder="cpnt.data._placeholder"
      >
        <el-option
          v-for="opt in fixedOptions"
          :key="opt._optionValue"
          :label="opt._fixedName || opt._optionName || opt._optionValue"
          :value="opt._fixedVal || opt._optionValue"
        ></el-option>
      </el-select>
      <el-radio-group :size="size" v-else v-model="cpnt.data._val">
        <el-radio-button
          :size="size"
          :label="opt._fixedVal || opt._optionValue"
          :disabled="!cpntEditable"
          v-for="opt in fixedOptions"
          :key="opt._optionValue"
          >{{ opt._fixedName || opt._optionName || opt._optionValue }}
        </el-radio-button>
      </el-radio-group>
    </template>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
import { optionFix } from "../mixins";
export default {
  mixins: [cpntMixin, optionFix],
};
</script>
