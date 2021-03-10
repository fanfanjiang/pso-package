<template>
  <div>
    <pso-title>表头设置</pso-title>
    <el-tree ref="tree" :data="header" node-key="id" default-expand-all :expand-on-click-node="false" draggable>
      <span class="tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" size="mini" @click="() => append(data)">添加</el-button>
          <el-button v-if="data.id !== '0'" type="text" size="mini" @click="() => edit(data)">编辑</el-button>
          <el-button v-if="data.id !== '0'" type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <pso-dialog :visible="showHEditor" @close="showHEditor = false" width="60%">
      <template #title>
        <div class="form-executor-header sql-designer-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>设置表头节点参数参数</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button size="mini" type="primary" icon="el-icon-upload" @click="save()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="padding: 15px; overflow: auto; height: 100%" v-if="showHEditor">
        <el-form label-width="80px">
          <el-form-item label="真实字段">
            <el-switch size="mini" v-model="hData.isField" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="名称">
            <el-input size="mini" v-model="hData.label" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择字段" v-if="hData.isField === '1'">
            <el-select filterable size="mini" v-model="hData.field">
              <el-option v-for="(d, i) in column" :key="i" :label="d.name" :value="d.field"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import shortid from "shortid";
export default {
  props: {
    header: Array,
    column: Array,
  },
  data() {
    return {
      showHEditor: false,
      curNode: null,
      hData: {
        isField: "1",
        label: "",
        field: "",
      },
      op: "",
    };
  },
  created() {
    console.log(this.header);
    if (!this.header.length) {
      this.header.push({ label: "表头", id: "0", field: "0", children: [] });
    } else {
      this.traverse(this.header);
    }
  },
  methods: {
    insert(data) {
      const node = this.$refs.tree.getCurrentNode() || this.$refs.tree.getNode("0");
      for (let d of data) {
        this.$refs.tree.append({ isField: "1", label: d.name || "未命名", field: d.field, id: shortid.generate() }, node);
      }
    },
    append(data) {
      this.op = "1";
      this.curNode = data;
      this.showHEditor = true;
    },
    edit(data) {
      this.op = "2";
      this.curNode = data;
      Object.assign(this.hData, data);
      delete this.hData.children;
      this.showHEditor = true;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    save() {
      if (this.op === "1") {
        const newChild = { ...this.hData, id: shortid.generate() };
        if (this.hData.isField === "1" && this.hData.field) {
          const f = _.find(this.column, { field: this.hData.field });
          if (f) {
            newChild.label = f.name;
          }
        }
        if (!this.curNode.children) {
          this.$set(this.curNode, "children", []);
        }
        this.curNode.children.push(newChild);
      } else if (this.op === "2") {
        if (this.hData.isField === "1" && this.hData.field) {
          const f = _.find(this.column, { field: this.hData.field });
          if (f) {
            this.hData.label = this.hData.label || f.name;
          }
        }
        Object.assign(this.curNode, { ...this.hData });
      }

      this.showHEditor = false;
    },
    traverse(list) {
      for (let d of list) {
        if (d.children) this.traverse(d.children);
        if (d.id !== "0") {
          d.id = shortid.generate();
        }
      }
    },
  },
};
</script> 
<style lang="less" scoped>
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>