<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    width="500"
    @show="opened = true"
    @after-leave="opened = false"
    v-model="show"
  >
    <div class="pso-picker" v-if="opened">
      <div class="pso-picker__body">
        <div class="pso-picker__body-l">
          <pso-tree-common
            ref="tree"
            :rootable="true"
            :edit-mode="false"
            :request-options="treeOptions"
            @node-click="nodeClickHandler"
            :tree-style="{ 'box-shadow': 'none', 'padding-right': '15px' }"
          ></pso-tree-common>
        </div>
        <div class="pso-picker__body-r">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="24" v-for="(t, i) in templates" :key="i">
              <p-template @click="onClickTemp(t)" :removeable="false" :data="t"></p-template>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-plus" plain size="mini">选择模板</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
import PTemplate from "../printer-designer/template";
export default {
  components: { PTemplate },
  props: {},
  data() {
    return {
      show: false,
      opened: false,
      treeOptions: {
        dimen: 3,
      },
      templates: [],
    };
  },
  created() {},
  methods: {
    async nodeClickHandler(node) {
      const ret = await this.API.getTreeNode({ code: node.node_name });
      this.templates = [];
      if (ret.success) {
        const { printer_config } = ret.data.data;
        if (printer_config) {
          this.templates = JSON.parse(printer_config);
        }
      }
    },
    onClickTemp(data) {
      this.$emit("selected", data);
      this.show = false;
    },
  },
};
</script>
<style lang="less" scoped>
</style>