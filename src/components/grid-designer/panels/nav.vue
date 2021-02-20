<template>
  <panel-wrapper :cpnt="cpnt">
    <common-panel :cpnt="cpnt" position="top">
      <el-form-item label="导航样式">
        <el-select clearable size="mini" v-model="cpnt.data.style">
          <el-option label="样式一" value="1"></el-option>
          <el-option label="样式二" value="2"></el-option>
          <el-option label="样式三" value="3"></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-bottom: 10px; text-align: right">
        <el-button size="mini" type="primary" plain @click="addHandler">添加导航</el-button>
        <el-button size="mini" type="danger" plain @click="delHandler">删除</el-button>
      </div>
      <el-table size="mini" style="width: 100%" border :data="cpnt.data.menus" @selection-change="changeSelection">
        <el-table-column type="selection" width="20"></el-table-column>
        <el-table-column label="名称" width="100" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.n"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="图标" width="66" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :icon="scope.row.icon" @click="setIcon(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="菜单" align="center">
          <template slot-scope="scope">
            <el-select filterable clearable size="mini" v-model="scope.row.v">
              <el-option v-for="(m, i) in menus" :key="i" :label="m.node_display" :value="m.node_name"></el-option>
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
    this.menus = [];
    return {
      showIcon: false,
      curData: null,
      selected: [],
    };
  },
  async created() {
    this.menus = await this.API.getMenuTree();
  },
  methods: {
    addHandler() {
      this.cpnt.data.menus.push({ n: "", v: "", icon: "el-icon-menu" });
    },
    delHandler() {
      this.selected.forEach((d) => {
        this.cpnt.data.menus.splice(this.cpnt.data.menus.indexOf(d), 1);
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