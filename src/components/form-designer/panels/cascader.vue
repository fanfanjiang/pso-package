<template>
  <div class="act-select-body">
    <common-panel :cpnt="cpnt" info="用于联动选择" :needDefaultValue="false" :needPlaceholder="false">
      <el-form-item label="数据源类型" required>
        <el-select size="mini" v-model="cpnt.data._type" placeholder="请选择">
          <el-option label="表单" value="1"></el-option>
          <el-option label="自定义" value="2"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="cpnt.data._type === '1'">
        <picker-form
          :data="cpnt.data"
          form-field="_source"
          source="3"
          :fields="[
            { n: 'ID字段', f: '_id' },
            { n: '父ID字段', f: '_parentId' },
            { n: '名称字段', f: '_name' },
            { n: '绑定字段', f: '_bindTarget' },
          ]"
        ></picker-form>
        <el-form-item label="初始父ID值">
          <el-input size="mini" v-model="cpnt.data._initParentVal"></el-input>
        </el-form-item>
        <el-form-item label="保存层数">
          <el-input-number size="mini" v-model="cpnt.data._level" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item :label="`第${i + 1}层绑定字段`" v-for="(v, k, i) in cpnt.data._bindField" :key="i">
          <el-select size="mini" v-model="cpnt.data._bindField[k]" clearable filterable>
            <el-option v-for="(u, i) in fieldOptions" :key="i" :label="u._fieldName" :value="u._fieldValue"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item class="tree-option" label="选项设置" v-if="cpnt.data._type === '2'">
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
              <el-button icon="el-icon-plus" type="text" size="medium" @click="() => showEditDialog(data)"></el-button>
              <el-button icon="el-icon-edit" type="text" size="medium" @click="() => showEditDialog(data, 'editNode')"></el-button>
              <el-button icon="el-icon-close" type="text" size="medium" @click="() => remove(node, data)"></el-button>
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
import PickerForm from "../../picker/pso-picker-form";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    PickerForm,
  },
  data() {
    return {
      treeProps: {
        children: "_option",
      },
      showTreeEdit: false,
      currentNode: null,
      currentNodeData: null,
      optionInputVal: "",
      optionType: "",
      fields: [],
    };
  },
  computed: {
    fieldOptions() {
      return this.cpnt.store.search({ options: { db: true }, onlyData: true });
    },
  },
  watch: {
    "cpnt.data._level": {
      handler() {
        this.analyzeBindField();
      },
    },
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
        _optionValue: this.optionInputVal,
      });
    },
    editNode() {
      this.currentNodeData._optionValue = this.optionInputVal;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data._option || parent.data;
      const index = children.findIndex((d) => d._optionId === data._optionId);
      children.splice(index, 1);
    },
    analyzeBindField() {
      const num = this.cpnt.data._level;
      const ori = _.cloneDeep(this.cpnt.data._bindField);
      this.cpnt.data._bindField = {};
      for (let i = num; i > 0; i--) {
        this.$set(this.cpnt.data._bindField, i, ori[i] || "");
      }
    },
  },
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