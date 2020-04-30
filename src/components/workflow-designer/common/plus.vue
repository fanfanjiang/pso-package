<template>
  <div class="pso-wf-plus">
    <el-button v-if="!readMode" @click="openPanel" type="primary" icon="el-icon-plus" size="mini" plain circle></el-button>
    <pso-drawer size="30%" :visible="showPanel" title="选择一个动作" @close="showPanel=false">
      <div class="pso-wf-panel-menu">
        <div class="pso-wf-panel-menu__item" v-for="menu of nodeMenu" :key="menu.title">
          <div class="pso-wf-panel-menu__title">{{menu.title}}</div>
          <el-row :gutter="10">
            <el-col :xs="6" :sm="6" v-for="menuItem of menu.children" :key="menuItem.name">
              <div class="pso-wf-panel-menu__body" @click="addNode(menuItem, node, pnode)">
                <i :class="menuItem.icon"></i>
                <div>{{menuItem.name}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </pso-drawer>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import nodeMenu from "../nodeMenu";
import { WF_NODE_ADD } from "@/store/mutation-types";

export default {
  props: ["node", "pnode", "readMode"],
  data() {
    return {
      showPanel: false,
      nodeMenu
    };
  },
  created() {},
  computed: {
    ...mapState(["workflowEditor"])
  },
  methods: {
    ...mapMutations([WF_NODE_ADD]),
    addNode(target, node, pnode) {
      this[WF_NODE_ADD]({ target, node, pnode });
      this.showPanel = false;
    },
    openPanel() {
      if (this.readMode) return;
      if (!this.workflowEditor.formId) {
        return this.$message({ message: "请选择工作表", type: "warning" });
      }
      this.showPanel = true;
    }
  }
};
</script>
<style lang="less" scoped>
</style>