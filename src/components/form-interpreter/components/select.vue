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
        <template v-for="opt in fixedOptions">
          <el-option
            v-if="!opt._hidden"
            :key="opt._optionValue"
            :value="opt._fixedVal || opt._optionValue"
            :label="opt._fixedName || opt._optionName || opt._optionValue"
          ></el-option>
        </template>
      </el-select>
      <el-radio-group :size="size" v-else v-model="cpnt.data._val">
        <template v-for="opt in fixedOptions">
          <el-radio
            v-if="!opt._hidden"
            :size="size"
            :key="opt._optionValue"
            :disabled="!cpntEditable"
            :label="opt._fixedVal || opt._optionValue"
          >
            {{ opt._fixedName || opt._optionName || opt._optionValue }}
          </el-radio>
        </template>
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
