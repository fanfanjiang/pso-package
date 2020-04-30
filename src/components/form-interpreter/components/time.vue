<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-time-picker
      v-if="cpnt.data._type==='time'"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
    ></el-time-picker>
    <el-date-picker
      v-else
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      v-model="cpnt.data._val"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      :type="cpnt.data._type"
      :placeholder="cpnt.data._placeholder"
    ></el-date-picker>
  </el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
import { DATE_OPTION } from "@/const/form";
import dayjs from "dayjs";

export default {
  mixins: [cpntMixin],
  created() {
    if (!this.cpnt.data._val && this.cpnt.data._defaultType) {
      const defType = _.find(DATE_OPTION[this.cpnt.data._type], { value: this.cpnt.data._defaultType });
      if (defType && defType.value === "1") {
        this.cpnt.data._val = dayjs().format("YYYY-MM-DD");
      }
    }
  }
};
</script>
