<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-time-picker
      ref="cpnt"
      v-if="cpnt.data._type==='time'"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
      :value-format="format"
      :format="format"
      :autofocus="cpnt.data._autofocus"
    ></el-time-picker>
    <el-date-picker
      v-else
      ref="cpnt"
      :value-format="format"
      :format="format"
      v-model="cpnt.data._val"
      :disabled="!cpnt.store.editable||cpnt.data._read"
      :type="cpnt.data._type"
      :placeholder="cpnt.data._placeholder"
      :autofocus="cpnt.data._autofocus"
    ></el-date-picker>
  </el-form-item>
</template>      
<script>
import cpntMixin from "../mixin";
import { DATE_OPTION } from "../../../const/form";
import dayjs from "dayjs";

const TIME_FORMAT = {
  date: "yyyy-MM-dd",
  datetime: "yyyy-MM-dd HH:mm:ss",
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
        this.cpnt.data._val = dayjs().format(TIME_FORMAT[this.cpnt.data._type].replace("yyyy", "YYYY").replace("dd", "DD"));
      }
    }
  },
  mounted() {
    if (this.cpnt.data._autofocus) {
      this.$refs.cpnt.focus();
    }
  },
};
</script>
