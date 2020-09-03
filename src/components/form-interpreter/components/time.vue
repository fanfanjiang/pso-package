<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-time-picker
      v-if="cpnt.data._type==='time'"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
      :value-format="format"
      :format="format"
    ></el-time-picker>
    <el-date-picker
      v-else
      :value-format="format"
      :format="format"
      v-model="cpnt.data._val"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      :type="cpnt.data._type"
      :placeholder="cpnt.data._placeholder"
    ></el-date-picker>
  </el-form-item>
</template>      
<script>
import cpntMixin from "../mixin";
import { DATE_OPTION } from "../../../const/form";
import dayjs from "dayjs";

const TIME_FORMAT = {
  date: "yyyy-MM-dd",
  datetime: "YYYY-MM-DD HH:mm:ss",
  time: "HH:mm:ss",
};

export default {
  mixins: [cpntMixin],
  computed: {
    format() {
      return TIME_FORMAT[this.cpnt.data._type];
    },
  },
  created() {
    if (!this.cpnt.data._val && this.cpnt.data._defaultType) {
      const defType = _.find(DATE_OPTION[this.cpnt.data._type], { value: this.cpnt.data._defaultType });
      if (defType && defType.value === "1") {
        this.cpnt.data._val = dayjs().format(TIME_FORMAT[this.cpnt.data._type]);
      }
    }
  },
};
</script>
