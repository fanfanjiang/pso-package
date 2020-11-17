<template>
  <common-panel :cpnt="cpnt" info="统计关联的记录中的数据。" :needDefaultValue="false">
    <el-form-item label="关联金额字段">
      <el-select v-model="cpnt.data._option" size="mini" placeholder="请选择">
        <el-option
          v-for="item in fieldOptions"
          :key="item.fid"
          :label="item._fieldName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      watchOptProxy: []
    };
  },
  computed: {
    fieldOptions() {
      this.watchOptProxy = this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: item => {
          if (item.fid === this.cpnt.fid) return false;
          if (item.parent.CPNT.host_db) return false;
          return true;
        }
      });
      return this.watchOptProxy;
    }
  },
  watch: {
    watchOptProxy: {
      deep: true,
      handler(val) {
        if (val && this.cpnt.data._option) {
          if (_.find(val, { fid: this.cpnt.data._option })) return;
        }
        this.cpnt.data._option = "";
        this.cpnt.data._defaultValue = "";
      }
    }
  }
};
</script>
