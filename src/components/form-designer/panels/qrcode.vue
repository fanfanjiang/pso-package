<template>
  <common-panel :cpnt="cpnt" info="选择表单中的字段显示为二维码" :needDefaultValue="false">
    <el-form-item label="设置二维码">
      <el-button icon="el-icon-plus" plain size="mini" @click="showDesigner = true">设置</el-button>
    </el-form-item>
    <pso-drawer size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner = false">
      <template v-slot:whole>
        <formula-designer
          :value="cpnt.data._datasource"
          :cpnts="numOptions"
          @cancel="showDesigner = false"
          @confirm="handleConfirm"
        ></formula-designer>
      </template>
    </pso-drawer>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";
import { common, FormulaMixin } from "../mixin";
import formulaDesigner from "../../form-designer/formula-designer";

export default {
  props: ["cpnt"],
  mixins: [common, FormulaMixin],
  components: {
    commonPanel,
    formulaDesigner,
  },
  data() {
    return {
      showDesigner: false,
    };
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
  methods: {
    handleConfirm(code) {
      this.cpnt.data._datasource = code;
      this.showDesigner = false;
    },
  },
};
</script>
