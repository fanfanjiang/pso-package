<template>
  <div class="cms-designer" v-if="!initializing">
    <div class="cms-designer__header">
      <el-dropdown @command="addHandler" size="mini" trigger="click">
        <span class="el-dropdown-link">
          添加模块
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(p, i) in plugins" :key="i" :command="p">{{ p.node_display }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="cms-designer__body">
      <grid-layout
        :layout.sync="layout"
        :col-num="24"
        :row-height="10"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        auto-size
        :margin="[20, 20]"
        :use-css-transforms="true"
      >
        <grid-item v-for="(item, i) in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="i">
          <div class="cms-designer-item">
            <i class="edit el-icon-edit-outline" @click.stop="editItem(i)"></i>
            <span>{{ item.n }}</span>
            <i class="delete el-icon-delete-solid" @click.stop="delItem(i)"></i>
          </div>
        </grid-item>
      </grid-layout>
    </div>
    <pso-drawer size="48%" :visible="showSetter" title="标签属性" @close="showSetter = false">
      <div style="padding: 15px">
        <plugin-setter :data="curLyt.params" :node="curLyt" field="code" :filter="[4]"> </plugin-setter>
      </div>
    </pso-drawer>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import shortid from "shortid";
import PluginSetter from "../plugin-setter";

export default {
  components: { PluginSetter },
  props: {
    layout: Array,
  },
  data() {
    this.plugins = [];
    return {
      initializing: true,
      curLyt: {},
      showSetter: false,
    };
  },
  async created() {
    this.initializing = true;
    this.plugins = await this.API.getTempleteTree([4]);
    this.initializing = false;
  },
  methods: {
    async addHandler({ node_name }) {
      const cfg = await this.API.getTreeNode({ code: node_name });
      const { tp_component, tp_name, tp_code } = cfg.data.data;
      if (!tp_component) return;
      let data = {
        i: shortid.generate(),
        id: tp_component,
        n: tp_name,
        w: parseInt(8),
        h: parseInt(8),
        code: node_name,
        params: [],
      };
      data = { ...data, ...this.getLocation(data) };
      this.layout.push(data);
    },
    getLocation(from) {
      if (!this.layout.length) return { x: 0, y: 0 };
      const target = this.layout[this.layout.length - 1];
      let x = target.x + target.w;
      x = x + from.w > 24 ? 0 : x;
      let y = x === 0 ? target.y + target.h : target.y;
      return { x, y };
    },
    editItem(index) {
      this.curLyt = this.layout[index];
      this.showSetter = true;
    },
    delItem(index) {
      this.layout.splice(index, 1);
    },
  },
};
</script>
