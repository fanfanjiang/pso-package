<template>
  <div>
    <common-panel
      :cpnt="cpnt"
      info="将当前记录中的字段进行数值或日期计算"
      :needPlaceholder="false"
      :needUnique="false"
    >
      <el-form label-position="top" label-width="80px">
        <el-form-item label="自定义脚本">
          <el-button icon="el-icon-plus" plain size="mini" @click="showDesigner=true">编辑脚本</el-button>
        </el-form-item>
        <el-form-item label="单位">
          <el-input size="mini" v-model="cpnt.data._unit"></el-input>
        </el-form-item>
        <el-form-item label="小数点">
          <el-input-number size="mini" v-model="cpnt.data._decimalPlaces" :min="0" :max="5"></el-input-number>
        </el-form-item>
      </el-form>
    </common-panel>
    <pso-drawer size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner=false">
      <template v-slot:whole>
        <formula-designer
          :value="cpnt.data._datasource"
          :cpnts="numOptions"
          @cancel="showDesigner=false"
          @confirm="handleConfirm"
        ></formula-designer>
      </template>
    </pso-drawer>
  </div>
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
      code: "",
    };
  },
  methods: {
    handleConfirm(code) {
      this.cpnt.data._datasource = code;
      this.showDesigner = false;
    },
  },
};
</script>

