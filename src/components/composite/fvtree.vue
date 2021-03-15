<template>
  <div :class="viewClass" v-if="config">
    <div class="pso-view-extend">
      <div class="pso-tree">
        <div class="pso-tree__body">
          <pso-tree-common
            ref="tree"
            node-key="leaf_id"
            :edit-mode="false"
            :draggable="false"
            :show-checkbox="false"
            :tree-props="treeProps"
            static-mode
            :filter="['d_name']"
            @node-click="nodeClickHandler"
          ></pso-tree-common>
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
        const { data_code, __mock__, __id__, d_name } = this.curNode;

        const $node = this.treeImage.getNode(this.curNode);
        const $pnode = $node ? $node.parent : null;

        const params = { defForm: null, titleText: d_name };
        let cfg = null;

        if (__mock__) {
          params.cfgId = data_code;
          cfg = this.getConfig({ id: __id__ });
          if ($pnode) {
            params.defForm = { [cfg.field]: $pnode.data[cfg.pfield] };
          }
        } else {
          cfg = this.getConfig({ pid: __id__ });
          if (cfg) {
            params.cfgId = cfg.fid;
            params.defForm = { [cfg.field]: this.curNode[cfg.pfield] };
          }
        }
        if (cfg) {
          if (params.defForm) {
            Object.assign(params.defForm, this.getRelations(cfg));
          }
          if (cfg.opts) {
            for (let item of cfg.opts) {
              if (typeof params[item.field] === "undefined") {
                params[item.field] = item.value;
              }
            }
          }
        }

        return { ...this.params, ...params };
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
    config() {
      if (this.params.fvtree && this.params.fvtree.length) {
        return this.params.fvtree;
      }
    },
    treeImage() {
      return this.$refs.tree.$refs.tree;
    },
    treeData: {
      get() {
        return this.$refs.tree.treeData;
      },
      set(data) {
        this.$refs.tree.treeData = data;
      },
    },
  },
  async created() {
    this.formNodes = await this.API.getFormTree();

    if (this.config) {
      this.treeData = this.makeDataNode(listToTree({ list: this.config }));
      //根节点数量
      if (this.treeData.length) {
        this.nodeClickHandler(this.treeData[0]);
      }
    }
  },
  methods: {
    makeDataNode(data) {
      return data.map((d) => {
        const { fid, id } = d;
        const node = _.find(this.formNodes, { node_name: fid });
        return { children: [], d_name: node.node_display, data_code: fid, leaf_id: id, __id__: id, __mock__: true, __loaded__: false };
      });
    },
    nodeClickHandler(node) {
      const { __id__ } = node;

      //当前节点的子节点配置
      const children = this.makeDataNode(this.config.filter((d) => d.pid === __id__));

      if (children.length > 1) {
        children.forEach((d) => this.treeImage.append(d, node));
        this.curNode = null;
      } else if (children.length) {
        this.curNode = node;
      } else {
        this.curNode = null;
      }
    },
    getConfig(option) {
      return _.find(this.config, option);
    },
    getRelations(config) {
      const relation = {};
      if (config.other) {
        const nodes = {};

        let $node = this.treeImage.getNode(this.curNode);
        while ($node && $node.data && $node.data.__id__) {
          if (!$node.data["__mock__"]) nodes[$node.data.__id__] = $node.data;
          $node = $node.parent;
        }

        for (let [k, { field, pfield }] of Object.entries(config.other)) {
          if (nodes[k]) {
            relation[field] = nodes[k][pfield];
          }
        }
      }
      return relation;
    },
    dataLoadHandler(data) {
      let { __mock__, __id__ } = this.curNode;

      if (!__mock__) {
        __id__ = this.getConfig({ pid: __id__ })["id"];
      }

      const subCfg = this.getConfig({ pid: __id__ });
      if (!subCfg) {
        return;
      }

      const isLeaf = this.getConfig({ pid: subCfg.id });

      data.forEach((d) => {
        d.__id__ = __id__;
        d.is_leaf = !!isLeaf ? 0 : 1;
        this.$set(d, "children", []);
        if (!this.treeImage.getNode(d)) {
          this.treeImage.append(d, this.treeImage.getNode(this.curNode));
        }
      });
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
