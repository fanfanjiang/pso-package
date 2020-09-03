<template>
  <el-form label-position="top">
    <template v-if="!initializing">
      <el-form-item label="选择工作表">
        <el-select
          size="mini"
          v-model="data[formField]"
          filterable
          placeholder="工作表"
          @change="changeHandler"
        >
          <el-option
            v-for="o in options"
            :key="o.node_name"
            :label="o.node_display"
            :value="o.node_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <template v-loading="loading">
        <el-form-item :label="f.n" v-for="(f,i) in fields" :key="i">
          <el-select size="mini" v-model="data[f.f]" filterable :multiple="isArray(data[f.f])">
            <el-option
              v-for="fo in fOptions"
              :key="fo._fieldValue"
              :label="fo.fieldDisplay"
              :value="fo._fieldValue"
            ></el-option>
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
  },
  async created() {
    this.initializing = true;
    this.options = await this.API.getFormTree();
    if (this.curCode) {
      this.changeHandler();
    }
    this.initializing = false;
  },
  methods: {
    async changeHandler() {
      if (this.curCode && !this.cache[this.curCode]) {
        this.loading = true;
        const store = await this.makeFormStore(this.curCode);
        this.$set(
          this.cache,
          this.curCode,
          store.search({
            options: { db: true },
            onlyData: true,
            beforePush: (item) => {
              item.data.fieldDisplay = `[${item.CPNT.name}]${item.data._fieldName}`;
              return !item.parent.CPNT.host_db;
            },
          })
        );
        this.loading = false;
      }
    },
    isArray(object) {
      return Array.isArray(object);
    },
  },
};
</script>