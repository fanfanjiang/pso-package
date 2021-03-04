<template>
  <el-form class="form-view__column-ast">
    <template v-if="relatedShowField">
      {{ showVal }}
    </template>
    <pso-cpnt-ast v-else-if="val && field._option" :cpnt="cpnt"></pso-cpnt-ast>
  </el-form>
</template>
<script>
import { genComponentData } from "../form-designer/helper";
export default {
  props: {
    field: Object,
    data: Object,
    store: Object,
  },
  data() {
    return {
      cpnt: { data: {} },
    };
  },
  computed: {
    relatedShowField() {
      return this.field.relatedShowField;
    },
    showVal() {
      return this.data[this.field.relatedShowField];
    },
    val() {
      return this.data[this.field.field_name];
    },
  },
  created() {
    if (!this.relatedShowField && this.val) {
      this.createCpnt(this.val);
    }
  },
  methods: {
    createCpnt(ids = "") {
      this.cpnt.data = genComponentData({ ...this.field, _fieldName: "", _val: ids, _read: true });
      this.cpnt.data._fieldName = "";
    },
  },
};
</script>