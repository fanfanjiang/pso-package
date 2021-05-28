<template>
  <div class="pso-tree" :class="{ search: searchable }" :style="treeStyle">
    <div class="pso-tree__header">
      <div class="pso-tree__search" v-if="searchable">
        <mu-text-field v-model="filterText">
          <template v-slot:prepend>
            <i class="el-icon-search"></i>
          </template>
        </mu-text-field>
      </div>
      <!-- <div v-if="editMode">
        <el-button icon="el-icon-plus" size="mini" circle @click="treeFunHandler('newFolder', { data: { tag_no: '' } })"></el-button>
      </div> -->
    </div>
    <pso-skeleton v-if="loadingWholeTree" :lines="10"></pso-skeleton>
    <div v-else class="pso-tree__body" v-loading="loading">
      <el-tree
        ref="tree"
        :node-key="nodeKey"
        :default-expand-all="defaultExpendAll"
        :draggable="draggable"
        :empty-text="emptyText"
        :data="treeData"
        :props="treeProps"
        :filter-node-method="filterNodeHandler"
        :allow-drop="allowDropHandler"
        :allow-drag="allowDragHandler"
        :lazy="lazyLoad"
        :load="getNodeData"
        :show-checkbox="showCheckbox"
        :expand-on-click-node="false"
        @node-drag-start="nodeDragStart"
        @node-click="nodeClickHandler"
        @node-drop="nodeDropHandler"
        @check="checkChangeHandler"
      >
        <span class="pso-tree__node" slot-scope="{ node }">
          <span class="pso-tree__node-title">
            <i class="pso-tree__node-icon" :class="getNodeIconClass(node)"></i>
            <span>{{ node.label }}</span>
          </span>
          <span v-if="editMode" :class="[{ 'pso-tree__node-btns': true }, { show: node.showMenu }]">
            <el-dropdown
              size="small"
              trigger="hover"
              :show-timeout="50"
              @command="treeFunHandler($event, node)"
              @visible-change="nodeMenuChangeHandler(node)"
            >
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <slot name="node-edit-menu">
                  <template v-if="!node.data.is_leaf">
                    <el-dropdown-item v-if="folderMode" command="newFolder">新建文件夹</el-dropdown-item>
                    <el-dropdown-item command="newNode">新建{{ nodeEditLable }}</el-dropdown-item>
                  </template>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </slot>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
      <el-dialog
        v-loading="nodePayload.loading"
        width="30%"
        :append-to-body="true"
        :close-on-click-modal="false"
        :title="nodePayload.formTitle"
        :visible.sync="nodePayload.showForm"
      >
        <el-form v-if="nodePayload.node" :model="nodePayload.node.data" label-width="80px">
          <el-form-item :label="nodePayload.nameLable">
            <el-input size="small" v-model="nodePayload.node.data.tag_name" autocomplete="off"></el-input>
          </el-form-item>
          <slot v-bind:node="nodePayload.node.data"></slot>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodePayload.showForm = false" size="small">取 消</el-button>
          <el-button size="small" type="primary" @click="editNode" :loading="nodePayload.loading" :disabled="nodePayload.loading">
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { listToTree } from "../../utils/util";
const treeRef = "tree";
export default {
  props: {
    treeStyle: {
      type: Object,
      default: () => ({}),
    },
    rootable: {
      type: Boolean,
      default: true,
    },
    defaultNodeData: {
      type: Object,
      default: () => ({}),
    },
    requestOptions: {
      type: Object,
      default: () => ({}),
    },
    sortOptions: {
      type: Array,
      default: () => [
        ["node_serial", "create_time"],
        ["asc", "asc"],
      ],
    },
    nodeDataFilter: Function,
    emptyText: {
      type: String,
      default: "无数据",
    },
    treeProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "tag_name",
        isLeaf: (data) => data.is_leaf === 1,
      }),
    },
    nodeKey: {
      type: String,
      default: "tag_no",
    },
    defaultExpend: {
      type: Boolean,
      default: true,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    nodeIconUri: {
      type: String,
      default: "/static/app/img/file-icon/",
    },
    folderMode: {
      //文件夹模式,非子节点都是文件夹
      type: Boolean,
      default: false,
    },
    editMode: {
      type: Boolean, //编辑模式
      default: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    deletable: {
      type: Boolean,
      default: true,
    },
    autoDelete: {
      type: Boolean,
      default: true,
    },
    autoEdit: {
      type: Boolean,
      default: true,
    },
    checkAfterLoad: {
      //加载后自动选择可选节点
      type: Boolean,
      default: true,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    checkAuth: {
      type: Boolean,
      default: false,
    },
    nodeEditLable: {
      type: String,
      default: "",
    },
    defaultNodeData: [Object, Function],
    filter: [Array, Function],
    searchable: {
      type: Boolean,
      default: true,
    },
    defaultNodeid: {
      type: String,
      default: "",
    },
    staticMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingWholeTree: false,
      loading: false,
      defaultExpendAll: this.defaultExpend,
      lazyLoad: this.lazy,
      filterText: "", //树搜索字段,
      where: {}, //查询数据
      treeData: [],
      nodePayload: {
        parent: null,
        node: null,
        nodeRef: null,
        showForm: false,
        loading: false,
        formTitle: "编辑",
        nameLable: "名称",
      },
      isCopy: false,
      selectedTrash: [],
      treeList: [],
      checkedDefaultNodeid: "",
      extendConfig: null,
    };
  },
  watch: {
    requestOptions: {
      deep: true,
      handler(val) {
        this.requestOptionHandler(val);
        this.loadWholeTree();
      },
    },
    filterText(val) {
      this.$refs[treeRef].filter(val);
    },
  },
  async created() {
    //检查树参数
    if (!this.staticMode) {
      this.requestOptionHandler(this.requestOptions);

      if (!this.lazyLoad) {
        this.loadWholeTree();
      } else {
        //懒加载时关闭自动展开全部
        this.defaultExpendAll = false;
      }
    }
  },
  methods: {
    async loadWholeTree(loading = true) {
      //加载整颗静态树
      this.loadingWholeTree = loading;

      this.treeData = await this.getNodeData();

      this.$emit("tree-loaded", this.treeData);

      this.loadingWholeTree = false;

      if (this.checkAfterLoad) {
        this.$nextTick(() => {
          if (this.checkedDefaultNodeid) {
            this.setCurrentNode([this.$refs[treeRef].getNode(this.checkedDefaultNodeid).data]);
          } else {
            this.setCurrentNode(this.treeData, 4);
          }
        });
      }
    },
    setCurrentNode(data, level = 1) {
      //设置默认节点
      let seted = false;
      const setNode = (nodeData) => {
        level -= 1;
        for (let n of nodeData) {
          if (!(this.folderMode && n.is_leaf === 0) && this.$refs[treeRef] && !seted) {
            seted = true;
            this.$refs[treeRef].setCurrentKey(n.tag_no);
            this.nodeClickHandler(n);
            return n;
          }
          level && n.children && setNode(n.children);
        }
      };
      setNode(data);
    },
    async getNodeData(node, resolve) {
      const options = { ...this.where, rootable: this.rootable, lazy: this.lazy, keys: {} };

      for (let key in this.where) {
        options.keys[key] = { value: this.where[key], type: 1 };
      }

      options.keys = JSON.stringify(options.keys);

      const ret = await this.API.tagtree({ data: options });

      let treeList = ret.data;

      //树节点过滤
      if (this.nodeDataFilter) {
        treeList = await this.nodeDataFilter(treeList);
      }

      this.$emit("data-loaded", treeList);

      //将列表数据转化为树结构数据
      const data = listToTree({
        list: treeList,
        pid: "tag_pid",
        id: "tag_no",
        each: (node) => {
          node.node_id = node.tag_no;
          node.node_display = node.tag_name;
          if (this.defaultNodeid == node.tag_no) {
            this.checkedDefaultNodeid = node.tag_no;
          }
        },
        afterPush: (node, pnode) => {
          pnode.children = _.orderBy(pnode.children, ...this.sortOptions);
        },
        beforePush: (node, pnode) => {
          return true;
        },
      });

      //如果是懒加载
      if (resolve) {
        resolve(data);

        if (this.checkAfterLoad) {
          this.setCurrentNode(data);
        }
      }

      if (!this.rootable && data.length && data[0].children) {
        return data[0].children;
      } else {
        return data;
      }
    },
    requestOptionHandler(options) { 
      this.where = _.cloneDeep(options);
      if (this.where.data_type) {
        this.where["tag_type"] = this.where.data_type;
      }
      delete this.where.data_type;
      delete this.where.dimen;
    },
    nodeMenuChangeHandler(node) {
      node.showMenu ? (node.showMenu = false) : (node.showMenu = true);
    },
    isLeaf({ data }) {
      return data.is_leaf === 1;
    },
    getNodeIcon(node) {
      return `${this.nodeIconUri}${this.folderMode && !this.isLeaf(node) ? "folder" : node.data.node_icon}${
        this.folderMode && !this.isLeaf(node)
          ? node.data.children && node.data.children.length && node.expanded
            ? "_expand"
            : ""
          : node.isCurrent
          ? "_expand"
          : ""
      }.png`;
    },
    getNodeIconClass(node) {
      const option = {};
      if (this.folderMode && !this.isLeaf(node)) {
        option["folder"] = true;
        if (node.data.children && node.data.children.length && node.expanded) {
          option["fa fa-folder-open"] = true;
        } else {
          option["fa fa-folder"] = true;
        }
      } else {
        option["node"] = true;
        option[`el-icon-document`] = true;
        if (node.isCurrent) {
          option["node-expanded"] = true;
        }
      }
      return option;
    },
    treeFunHandler(command, node) {
      switch (command) {
        case "newFolder":
          this.$emit("before-folder-set", this.nodePayload);
          this.setNodePayload({ parent: node, node: this.getEmptyNode({ tag_pid: node.data.tag_no }) });
          this.$emit("before-folder-new", this.nodePayload);
          this.nodePayload.showForm = true;
          break;
        case "newNode":
          this.$emit("before-node-set", this.nodePayload);
          this.setNodePayload({ parent: node, node: this.getEmptyNode({ is_leaf: 1 }) });
          this.$emit("before-node-new", this.nodePayload);
          this.nodePayload.showForm = this.autoEdit;
          break;
        case "edit":
          this.setNodePayload({ node });
          this.$emit("before-node-edit", this.nodePayload);
          this.nodePayload.showForm = true;
          break;
        case "delete":
          this.$emit("before-node-delete", node.data);
          if (this.autoDelete) {
            this.deleteNode(node.data);
          }
          break;
      }
    },
    getEmptyNode(data = {}) {
      if (this.defaultNodeData) {
        if (typeof this.defaultNodeData === "function") {
          data = this.defaultNodeData(data, this.requestOptions);
        } else {
          Object.assign(data, this.defaultNodeData);
        }
      }

      data.tag_info = data.tag_info || "";
      data.tag_type = data.tag_type || "";
      typeof data.is_leaf === "undefined" && (data.is_leaf = 0);
      return { data };
    },
    setNodePayload({ parent, node }) {
      this.nodePayload.parent = parent;
      this.nodePayload.node = _.cloneDeep(node);
      this.nodePayload.nodeRef = node;
      this.nodePayload.formTitle = node.tag_no ? "编辑" : "新增";
    },
    async deleteNode(data) {
      return this.moveToTrash(data);
    },
    async editNode() {
      const data = this.nodePayload.node.data;
      const parent = this.nodePayload.parent;
      const IS_NEW = typeof data.tag_no === "undefined";

      if (typeof data.tag_type === "undefined") data.tag_type = this.where.tag_type;

      //新增
      if (IS_NEW) {
        Object.assign(data, { tag_pid: parent.data.tag_no });
      }

      this.nodePayload.loading = true;

      this.$emit("before-edit-submit", data);

      for (let key in data) {
        if (_.isNull(data[key])) {
          delete data[key];
        }
      }

      const ret = await this.API.tagtree({ data, method: IS_NEW ? "post" : "put" });

      if (!ret.success) {
        this.nodePayload.loading = false;
        return;
      }

      if (!IS_NEW) {
        //编辑节点
        this.nodePayload.nodeRef.data = Object.assign(this.nodePayload.nodeRef.data, data);
      }

      this.$nextTick(async () => {
        this.nodePayload.loading = false;
        this.nodePayload.showForm = false;

        if (IS_NEW) {
          await this.loadWholeTree(false);
        } else {
          this.$notify({ title: "成功", message: "添加成功", type: "success" });
          this.$emit(data.tag_no ? "after-node-edit" : "after-node-new", data);
          this.setCurrentNode([data]);
        }
      });
    },
    nodeDragStart(node, event) {
      this.isCopy = event.ctrlKey;
    },
    allowDropHandler(draggingNode, dropNode, type) {
      if (type === "inner" && this.isLeaf(dropNode)) return false;
      if (this.rootable && dropNode.level === 1 && type !== "inner") return false;
      return true;
    },
    allowDragHandler(node) {
      return (this.rootable ? node.level !== 1 : true) && this.editMode;
    },
    nodeClickHandler(data) {
      this.$emit("node-click", data);
    },
    getCheckedNodes() {
      return this.$refs[treeRef].getCheckedNodes();
    },
    getCheckedKeys() {
      return this.$refs[treeRef].getCheckedNodes();
    },
    getElementTreeRef() {
      return this.$refs[treeRef];
    },
    checkChangeHandler() {
      this.$emit("node-checked", this.getCheckedNodes());
    },
    filterNodeHandler(value, data, node) {
      let keys = ["tag_name"];
      if (this.filter) {
        if (typeof this.filter === "function") {
          return this.filter(value, data, node);
        }
        keys = this.filter;
      }
      for (let key of keys) {
        if ((data[key] + "").indexOf(value) !== -1) return true;
      }
      return false;
    },
  },
};
</script>
