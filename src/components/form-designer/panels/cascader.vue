<template>
  <div class="act-select-body">
    <common-panel :cpnt="cpnt" info="用于联动选择" :needDefaultValue="false" :needPlaceholder="false">
      <el-form-item class="tree-option" label="选项设置">
        <el-button type="text" size="mini" icon="el-icon-plus" @click="showEditDialog(null)">添加一级选项</el-button>
        <el-tree
          :data="cpnt.data._option"
          :props="treeProps"
          show-checkbox
          node-key="_optionId"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data._optionValue }}</span>
            <span>
              <el-button
                icon="el-icon-plus"
                type="text"
                size="medium"
                @click="() => showEditDialog(data)"
              ></el-button>
              <el-button
                icon="el-icon-edit"
                type="text"
                size="medium"
                @click="() => showEditDialog(data,'editNode')"
              ></el-button>
              <el-button
                icon="el-icon-close"
                type="text"
                size="medium"
                @click="() => remove(node, data)"
              ></el-button>
            </span>
          </span>
        </el-tree>
      </el-form-item>
    </common-panel>
    <el-dialog title="添加选项" append-to-body :visible.sync="showTreeEdit" :width="'400px'">
      <el-form>
        <el-form-item label="选项名称">
          <el-input v-model="optionInputVal" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showTreeEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleTreeEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import shortid from "shortid";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  data() {
    return {
      treeProps: {
        children: "_option"
      },
      showTreeEdit: false,
      currentNode: null,
      currentNodeData: null,
      optionInputVal: "",
      optionType: ""
    };
  },
  methods: {
    showEditDialog(data, type) {
      this.optionType = type || "appendNode";
      this.optionInputVal = this.optionType === "editNode" ? data._optionValue : "";
      this.currentNodeData = data || this.cpnt.data;
      this.showTreeEdit = true;
    },
    handleTreeEdit() {
      this[this.optionType] && this[this.optionType]();
      this.optionInputVal = "";
      this.showTreeEdit = false;
    },
    appendNode() {
      if (!this.currentNodeData._option) {
        this.$set(this.currentNodeData, "_option", []);
      }
      this.currentNodeData._option.push({
        _optionId: shortid.generate(),
        _optionValue: this.optionInputVal
      });
    },
    editNode() {
      this.currentNodeData._optionValue = this.optionInputVal;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data._option || parent.data;
      const index = children.findIndex(d => d._optionId === data._optionId);
      children.splice(index, 1);
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";

@{deep} .tree-option {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-checkbox__inner {
    border-radius: 100%;
  }
  .el-icon-close {
    color: #f56c6c;
  }
}
</style>