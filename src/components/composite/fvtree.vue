<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <div class="pso-tree">
        <div class="pso-tree__body">
          <el-tree
            ref="tree"
            node-key="leaf_id"
            :default-expand-all="true"
            :empty-text="emptyText"
            :data="treeData"
            :props="treeProps"
            @node-click="nodeClickHandler"
          >
            <span class="pso-tree__node" slot-scope="{ node }">
              <span class="pso-tree__node-title">
                <span>{{ node.data.d_name }}</span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <div class="pso-view-body">
      <div class="pso-view-table" style="height: 100%" v-if="curNode">
        <pso-form-view v-bind="formParams" :params="formParams" @data-loaded="dataLoadHandler"></pso-form-view>
      </div>
    </div>
  </div>
</template>
<script>
import { listToTree } from "../../utils/util";

export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      initializing: true,
      curNode: null,
      emptyText: "暂无数据",
      formNodes: [],
      treeData: [],
      treeProps: {
        children: "children",
        label: "d_name",
        isLeaf: (data) => data.is_leaf === 1,
      },
    };
  },
  computed: {
    formParams() {
      if (this.curNode) {
        const params = {};
        const { data_code, __mock__, __id__ } = this.curNode;
        const node = this.$refs.tree.getNode(this.curNode);
        let pnode = null;
        if (node) {
          pnode = node.parent;
        }
        const fvtree = this.params.fvtree;
        let defForm = null;
        if (__mock__) {
          params.cfgId = data_code;
          const item = _.find(fvtree, { id: __id__ });
          if (pnode) {
            defForm = { [item.field]: pnode.data[item.pfield] };
          }
        } else {
          const item = _.find(fvtree, { pid: __id__ });
          if (item) {
            params.cfgId = item.fid;
            defForm = { [item.field]: this.curNode[item.pfield] };
          }
        }

        return { ...this.params, ...params, defForm };
      }
    },
    viewClass() {
      return {
        "pso-view__expand": true,
        "pso-view__expand-wider": true,
        "pso-view-mgt": true,
        "pso-view": true,
        "pso-fvtree": true,
      };
    },
  },
  async created() {
    this.formNodes = await this.API.getFormTree();
    const fvtree = this.params.fvtree;
    if (fvtree) {
      const tree = this.makeDataNode(listToTree({ list: fvtree }));
      if (tree.length > 1) {
        this.treeData = tree;
      }
      if (tree.length) {
        this.nodeClickHandler(tree[0]);
      }
    }
  },
  methods: {
    makeDataNode(data) {
      return data.map((d) => {
        const { fid, id } = d;
        const node = _.find(this.formNodes, { node_name: fid });
        return { d_name: node.node_display, data_code: fid, leaf_id: id, __id__: id, __mock__: true, __loaded__: false };
      });
    },
    nodeClickHandler(node) {
      const { __id__ } = node;
      const fvtree = this.params.fvtree;
      const children = this.makeDataNode(fvtree.filter((d) => d.pid === __id__));
      if (children.length > 1) {
        children.forEach((d) => {
          this.$refs.tree.append(d, node);
        });
        this.curNode = null;
      } else if (children.length) {
        this.curNode = node;
      } else {
        this.curNode = null;
      }
    },
    dataLoadHandler(data) {
      const fvtree = this.params.fvtree;
      let { __mock__, __id__ } = this.curNode;
      if (!__mock__) {
        const item = _.find(fvtree, { pid: __id__ });
        __id__ = item.id;
      }

      if (!_.find(fvtree, { pid: __id__ })) {
        return;
      }

      if (this.treeData.length) {
        data.forEach((d) => {
          d.__id__ = __id__;
          if (!this.$refs.tree.getNode(d)) {
            this.$refs.tree.append(d, this.$refs.tree.getNode(this.curNode));
          }
        });
      } else {
        data.forEach((d) => {
          d.__id__ = __id__;
        });
        this.treeData = data;
      }
    },
  },
};
</script>
<style lang="less">
.pso-fvtree {
  .pso-view-body {
    .pso-view-body {
      padding: 0 !important;
    }
  }
}
</style>
