<template>
  <el-form :label-position="position" label-width="90px">
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
      // if (this.curCode && !this.cache[this.curCode]) {
      this.loading = true;

      let fields = [];
      const store = await this.makeFormStore(this.curCode, { designMode: false, requiredappid: this.requiredappid });

      fields = store.search({
        options: { db: true },
        onlyData: true,
        beforePush: (item) => {
          item.data.fieldDisplay = `[${item.CPNT.name}]${item.data._fieldName}`;
          return !item.parent.CPNT.host_db;
        },
      });
  
      if (this.source === "2" || this.source === "3") {
        fields = [];
        const ret = await this.API.getFormDict({ data_code: this.curCode, requiredappid: this.requiredappid });
        ret.data.forEach((d) => {
          const f = store.searchByField(d.field_name);

          if (f) {
            Object.assign(d, f.data);
          }

          const mixedBlood = d.field_name === "d_tag" || d.field_name === "d_name";
          const noSys = f && !mixedBlood;

          d.is_sys = noSys ? "0" : "1";
          d._fieldValue = d.field_name;
          d.fieldDisplay = noSys
            ? `${f.data._fieldName}@${d.field_name}@${f.CPNT.name}`
            : `系统@${d.field_name}@${mixedBlood ? f.data._fieldName : ""}`;

          if (this.source === "3") {
            if (!/\S+_s$/.test(d.field_name) && !/\S+_x$/.test(d.field_name)) {
              fields.push(d);
            }
          } else {
            fields.push(d);
          }
        });
      }

      fields = _.orderBy(fields, ["is_sys"], ["asc"]);
      this.$set(this.cache, this.curCode, fields);
      this.$emit("loaded", { fields, store, config: this.formConfig, forms: this.options });

      this.loading = false;
      // }
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