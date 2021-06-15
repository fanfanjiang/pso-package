<template>
  <el-checkbox-group v-model="proxy">
    <el-checkbox v-for="AU in WF_FIELD_AUTH" :label="AU.v" :key="AU.n">{{ AU.n }}</el-checkbox>
  </el-checkbox-group>
</template>
<script>
import { WF_FIELD_AUTH } from "../../../const/workflow";
export default {
  props: {
    data: Object,
    field: String,
  },
  data() {
    this.WF_FIELD_AUTH = WF_FIELD_AUTH;
    return {
      proxy: [],
    };
  },
  watch: {
    proxy(value) {
      this.data[this.field] = _.sum(value);
    },
  },
  created() {
    this.proxy = this.figureToList(this.data[this.field]);
  },
  methods: {
    figureToList(value) {
      const list = [];
      WF_FIELD_AUTH.forEach((a) => {
        if ((a.v & value) === a.v) list.push(a.v);
      });
      return list;
    },
  },
};
</script>