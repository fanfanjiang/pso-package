<template>
  <common-panel :cpnt="cpnt" info="从预设的地址中进行选择" :needPlaceholder="true" :needDefaultValue="false">
    <el-form-item label="选择类型">
      <el-radio v-model="cpnt.data._type" label="county">省-市-县</el-radio>
      <el-radio v-model="cpnt.data._type" label="city">省-市</el-radio>
      <el-radio v-model="cpnt.data._type" label="province">省</el-radio>
    </el-form-item>
    <form-area :cpnt="area" @value-change="handleValChange"></form-area>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";
import FormArea from "@/components/form-interpreter/components/area";
import { genComponentData } from "../helper";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    FormArea
  },
  data() {
    return {
      area: {}
    };
  },
  watch: {
    "cpnt.data._type"(val) {
      this.area.data._type = val;
    }
  },
  created() {
    this.$set(
      this.area,
      "data",
      genComponentData({
        componentid: this.cpnt.componentid,
        _type: this.cpnt.data._type,
        _fieldName: "设置默认关联",
        _required: false,
        _val: this.cpnt.data._defaultValue
      })
    );
  },
  methods: {
    handleValChange({ value }) {
      this.cpnt.data._defaultValue = value;
    }
  }
};
</script>

