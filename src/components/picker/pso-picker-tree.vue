<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    width="400"
    @show="opened=true"
    @after-leave="opened=false"
    v-model="show"
  >
    <div class="pso-picker-tree" v-if="opened">
      <div class="pso-picker-tree__body">
        <pso-tree-common
          ref="tree"
          :rootable="rootable"
          :request-options="requestOptions"
          :edit-mode="false"
          :draggable="false"
          :show-checkbox="showCheckbox"
          :check-after-load="false"
          :tree-style="{'box-shadow':'none',padding:0}"
          @node-click="nodeClickHandler"
          @node-checked="nodeCheckHandler"
        ></pso-tree-common>
      </div>
      <div class="pso-picker__showlist">
        <span v-for="item of selectedData" :key="item.node_id">
          <el-tag>{{item.node_display}}</el-tag>
        </span>
      </div>
      <div class="pso-picker__controller">
        <el-button @click="show=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-plus" plain size="small">{{btnText}}</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
export default {
  props: {
    appid: {
      type: String,
      default: "3"
    },
    pattern: {
      type: String,
      default: "radio"
    },
    show: {
      type: Boolean,
      default: false
    },
    rootable: {
      type: Boolean,
      default: false
    },
    requestOptions: Object,
    btnText: {
      type: String,
      default: ""
    },
    filter: Function
  },
  data() {
    return {
      opened: false,
      selectedData: []
    };
  },
  computed: {
    showCheckbox() {
      return this.pattern === "checkbox";
    }
  },
  methods: {
    nodeClickHandler(data) {
      this.checkNodes([data]);
    },
    nodeCheckHandler(data) {
      this.checkNodes(data);
    },
    checkNodes(nodes) {
      if (this.filter) nodes = this.filter(nodes);
      if (nodes.length) this.selectedData = nodes;
    },
    confirm() {
      this.$emit("confirm", this.getSelectedData());
      this.show = false;
    },
    getSelectedData() {
      return _.cloneDeep(this.selectedData);
    }
  }
};
</script>
<style lang="less" scoped>
.pso-picker-tree {
  height: 400px;
  .pso-picker-tree__body {
    height: 300px;
  }
}
.pso-picker__showlist {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
.pso-picker__controller {
  margin-top: 20px;
  text-align: right;
}
</style>