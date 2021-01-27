<template>
  <common-panel :cpnt="cpnt" info="选择表单中的字段显示为二维码" :needDefaultValue="false">
    <el-form-item label="关联字段">
      <el-select multiple filterable clearable v-model="cpnt.data._option" size="mini" placeholder="请选择">
        <el-option v-for="(f, i) in fieldOptions" :key="i" :label="f._fieldName" :value="f._fieldValue"></el-option>
      </el-select>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
  },
  data() {
    return {};
  },
  computed: {
    fieldOptions() {
      return this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: (item) => {
          if (item.fid === this.cpnt.fid) return false;
          if (item.parent.CPNT.host_db) return false;
          return true;
        },
      });
    },
  },
};
</script>
