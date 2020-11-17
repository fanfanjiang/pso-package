<template>
  <el-form>
    <form-component v-if="cpnt" :cpnt="cpnt" @value-change="handleChange"></form-component>
  </el-form>
</template>
<script>
import FormComponent from "../form-interpreter/cpnt";
import FormStore from "../form-designer/model/store.js";
export default {
  components: { FormComponent },
  props: ["data", "value"],
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      cpnt: null,
      store: null,
    };
  },
  created() {
    this.store = new FormStore({ designMode: false, data_config: [this.data] });
    this.store.updateInstance({ [this.data._fieldValue]: this.data._val });
    this.cpnt = this.store.search({ options: { fid: this.data.fid } });
    this.cpnt.data._hideForever = false;
    this.cpnt.data._hideOnNew = false;
    this.cpnt.data._fieldName = "";
    this.$set(this.cpnt.data, "__forceEdit__", true);
  },
  mounted() {
    this.handleChange({ value: this.cpnt.data._val });
  },
  methods: {
    handleChange({ value }) {
      this.$emit("change", value);
    },
  },
};
</script>
