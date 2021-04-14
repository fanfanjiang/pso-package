<template>
  <el-form :label-position="position" label-width="90px" :size="size">
    <template v-if="!initializing">
      <el-form-item :label="fromText" :required="required">
        <el-select size="mini" :clearable="clearable" v-model="data[formField]" filterable placeholder="工作表" @change="changeHandler">
          <el-option v-for="o in formOptions" :key="o.node_name" :label="o.node_display" :value="o.node_name"></el-option>
        </el-select>
      </el-form-item>
      <template v-loading="loading">
        <el-form-item :label="f.n" v-for="(f, i) in fields" :key="i">
          <el-select size="mini" v-model="data[f.f]" filterable :multiple="isArray(data[f.f])" @change="selectHandler($event, f.f)">
            <el-option v-for="fo in fOptions" :key="fo._fieldValue" :label="fo.fieldDisplay" :value="fo._fieldValue"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </template>
    <pso-skeleton v-else :lines="3"></pso-skeleton>
  </el-form>
</template>
<script>
import { formOp } from "../form-designer/mixin";
export default {
  mixins: [formOp],
  props: {
    data: Object,
    formField: String,
    fields: Array,
    source: {
      type: String,
      default: "1",
    },
    position: {
      type: String,
      default: "top",
    },
    fromText: {
      type: String,
      default: "选择工作表",
    },
    required: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    filter: Array,
    requiredappid: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "small",
    },
  },
  data() {
    return {
      initializing: true,
      loading: false,
      options: [],
      cache: {},
    };
  },
  computed: {
    curCode() {
      return this.data[this.formField];
    },
    fOptions() {
      if (this.curCode && this.cache[this.curCode]) {
        return this.cache[this.curCode];
      }
      return [];
    },
    formOptions() {
      if (this.filter) {
        return this.options.filter((o) => {
          return this.filter.includes(o.node_name);
        });
      } else {
        return this.options;
      }
    },
  },
  async created() {
    this.initializing = true;
    this.options = await this.API.getFormTree({ requiredappid: this.requiredappid });
    if (this.curCode) {
      this.changeHandler();
    }
    this.initializing = false;
  },
  methods: {
    async changeHandler() {
      this.loading = true;

      const store = await this.makeFormStore(this.curCode, { designMode: false, requiredappid: this.requiredappid });
      const fields = await this.makeFormFields({ source: this.source, code: this.curCode, requiredappid: this.requiredappid });

      this.$set(this.cache, this.curCode, fields);
      this.$emit("loaded", { fields, store, config: this.formConfig, forms: this.options });

      this.loading = false;
    },
    isArray(object) {
      return Array.isArray(object);
    },
    selectHandler(_fieldValue, target) {
      const field = _.find(this.cache[this.curCode], { _fieldValue });
      this.$emit("select", { field, target });
    },
  },
};
</script>