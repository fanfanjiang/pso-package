<template>
  <panel-wrapper :cpnt="cpnt">
    <common-panel :cpnt="cpnt" position="top">
      <el-form-item label="标签样式">
        <el-select clearable size="mini" v-model="cpnt.data.style">
          <el-option label="样式一" value="1"></el-option>
          <el-option label="样式二" value="2"></el-option>
          <el-option label="样式三" value="3"></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-bottom: 10px; text-align: right">
        <el-button size="mini" type="primary" plain @click="addHandler">添加标签</el-button>
        <el-button size="mini" type="danger" plain @click="delHandler">删除</el-button>
      </div>
      <el-table size="mini" style="width: 100%" border :data="cpnt.data.tabs" @selection-change="changeSelection">
        <el-table-column type="selection" width="20"></el-table-column>
        <el-table-column label="名称" width="100" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.n"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="图标" width="66" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :icon="scope.row.icon" @click="setIcon(scope.row)">{{ scope.row.icon ? "" : "无" }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-select filterable clearable size="mini" v-model="scope.row.v">
              <el-option v-for="(m, i) in tabs" :key="i" :label="m.child_name" :value="m.child_id"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </common-panel>
    <el-dialog title="选择图标" append-to-body :visible.sync="showIcon" width="80%">
      <pso-picker-icon @select="pickIcon"></pso-picker-icon>
    </el-dialog>
  </panel-wrapper>
</template>    
<script>
import PanelWrapper from "../panel";
import CommonPanel from "../common-panel";
import { CpntMixin } from "../mixin";

export default {
  components: { PanelWrapper, CommonPanel },
  mixins: [CpntMixin],
  data() {
    this.tabs = [];
    return {
      showIcon: false,
      curData: null,
      selected: [],
    };
  },
  async created() {
    const plugs = await this.API.getTempleteTree([2]);
    for (let item of plugs) {
      const ret = await this.API.getPluginModules({ keys: JSON.stringify({ tp_code: { type: 1, value: item.node_name } }) });
      this.tabs = this.tabs.concat(ret.data);
    }
  },
  methods: {
    addHandler() {
      this.cpnt.data.tabs.push({ n: "", v: "", icon: "el-icon-menu" });
    },
    delHandler() {
      this.selected.forEach((d) => {
        this.cpnt.data.tabs.splice(this.cpnt.data.tabs.indexOf(d), 1);
      });
    },
    setIcon(data) {
      this.curData = data;
      this.showIcon = true;
    },
    pickIcon(icon) {
      this.curData.icon = icon;
      this.showIcon = false;
    },
    changeSelection(data) {
      this.selected = data;
    },
  },
};
</script> 