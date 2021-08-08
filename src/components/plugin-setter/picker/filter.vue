<template>
  <div>
    <el-button size="mini" type="primary" plain @click="showRule = true"> 设置条件 </el-button>
    <el-input clearable v-model="data.value" size="mini" autocomplete="off"></el-input>
    <pso-dialog :visible="showRule" width="50%" @close="showRule = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>数据约束条件设置</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="makeFilter">确定</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
        <dynamic-filter :targets="fields" :sources="sources" v-model="condition"></dynamic-filter>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import DynamicFilter from "../../dynamic-filter";
export default {
  components: { DynamicFilter },
  props: {
    data: Object,
    fields: Array,
    sources: Array,
  },
  data() {
    return {
      showRule: false,
      condition: [],
    };
  },
  methods: {
    makeFilter() {
      const ret = [];
      this.condition.forEach((citem) => {
        const { value, op, tid, sid } = citem;
        if (tid) {
          if (sid) {
            ret.push(`${tid}#$__${sid}__$#${op}`);
          } else if (value !== "" && typeof value !== "undefined") {
            ret.push(`${tid}#${value}#${op}`);
          }
        }
      });
      if (ret.length) {
        this.data.value = ret.join(";");
      }
      this.showRule = false;
    },
  },
};
</script>