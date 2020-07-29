<template>
  <div>
    <el-form-item label="是否动态修正">
      <el-switch size="small" v-model="cpnt.data._prefix"></el-switch>
    </el-form-item>
    <template v-if="cpnt.data._prefix">
      <el-form-item label="修正方式">
        <el-select size="small" v-model="cpnt.data._prefixType" placeholder="请选择">
          <el-option label="前插" value="1"></el-option>
          <el-option label="后插" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修正类型" v-if="fixtype">
        <el-checkbox-group v-model="cpnt.data._prefixList">
          <el-checkbox label="1">修正名称</el-checkbox>
          <el-checkbox label="2">修正值</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="设置插入脚本">
        <el-button icon="el-icon-plus" plain size="small" @click="showDesigner=true">编辑脚本</el-button>
      </el-form-item>
    </template>
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
import formulaDesigner from "../../form-designer/formula-designer";

export default {
  components: { formulaDesigner },
  props: {
    cpnt: {
      type: Object,
    },
    fixtype: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showDesigner: false,
      code: "",
    };
  },
  computed: {
    numOptions() {
      const mainCpnts = this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: (item) => {
          if (item.fid === this.cpnt.fid) return false;
          if (item.parent.CPNT.host_db) return false;
          return true;
        },
      });
      const asstables = this.cpnt.store.search({
        options: { componentid: "asstable" },
        beforePush: (item) => {
          if (!item.data._option) return false;
          return true;
        },
      });
      let astFields = [];
      asstables.forEach((ast) => {
        astFields = astFields.concat(ast.cache.fieldOptions);
      });
      return mainCpnts.concat(astFields);
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