<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <el-time-picker
      v-if="cpnt.data._type === 'time'"
      ref="cpnt"
      size="small"
      :disabled="!cpntEditable"
      v-model="cpnt.data._val"
      :placeholder="cpnt.data._placeholder"
      :value-format="format"
      :format="displayFormat"
      :autofocus="cpnt.data._autofocus"
    ></el-time-picker>
    <el-date-picker
      v-else
      ref="cpnt"
      size="small"
      :value-format="format"
      :format="displayFormat"
      v-model="cpnt.data._val"
      :disabled="!cpntEditable"
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
  year: "yyyy-MM-dd HH:mm:ss",
  month: "yyyy-MM-dd HH:mm:ss",
  week: "yyyy-MM-dd HH:mm:ss",
};

const TIME_DISPLAY_FORMAT = {
  date: "yyyy-MM-dd",
  datetime: "yyyy-MM-dd HH:mm:ss",
  time: "HH:mm:ss",
  year: "yyyy",
  month: "yyyy-MM",
  week: "yyyy 第 WW 周",
};

export default {
  mixins: [cpntMixin],
  computed: {
    format() {
      return TIME_FORMAT[this.cpnt.data._type];
    },
    displayFormat() {
      return TIME_DISPLAY_FORMAT[this.cpnt.data._type];
    },
  },
  created() {
    if (!this.cpnt.data._val && this.cpnt.data._defaultType) {
      const defType = _.find(DATE_OPTION[this.cpnt.data._type], { value: this.cpnt.data._defaultType });
      if (defType && defType.value === "1") {
        this.cpnt.data._val = dayjs().format(TIME_FORMAT[this.cpnt.data._type].replace("yyyy", "YYYY").replace("dd", "DD"));
      }
    }
    this.makeShowValue();
  },
  mounted() {
    if (this.cpnt.data._autofocus) {
      this.$refs.cpnt.focus();
    }
  },
  methods: {
    makeShowValue() {
      if (this.cpnt.data._val) {
        this.cpnt.data.__showVal__ = this.formatTime(this.cpnt.data._val);
      } else {
        this.cpnt.data.__showVal__ = "";
      }
    },
    formatTime(value) {
      try {
        return dayjs(value).format(this.transToDayjs(TIME_DISPLAY_FORMAT[this.cpnt.data._type]));
      } catch (error) {}
      return "";
    },
    transToDayjs(str) {
      return str.replace("yyyy", "YYYY").replace("dd", "DD");
    },
  },
};
</script>
