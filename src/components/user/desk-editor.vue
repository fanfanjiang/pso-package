<template>
  <div class="pso-desk-editor">
    <div class="pso-desk-editor__header">
      <el-dropdown @command="addHandler" size="mini" trigger="click">
        <span class="el-dropdown-link">
          添加模块
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(desk, i) in desks" :key="i" :command="desk">{{ desk.map_key0 }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="pso-desk-editor__body">
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
          <div class="pso-desk-item">
            <span>{{ item.n }}</span>
            <i class="el-icon-delete-solid" @click.stop="delItem(i)"></i>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>
<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import shortid from "shortid";

export default {
  props: {
    layout: Array,
    desks: Array,
  },
  created() {
    ["entrance", "todo"].forEach((id) => {
      const index = _.findIndex(this.layout, { id });
      const data = this.layout[index];
      this.layout.splice(index, 1);
      this.layout.unshift(data);
    });
  },
  methods: {
    addHandler({ map_key0, map_key1, map_key2, map_key3 }) {
      let data = {
        i: shortid.generate(),
        id: map_key1,
        n: map_key0,
        w: parseInt(map_key3 || 8),
        h: parseInt(map_key2 || 8),
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
    delItem(index) {
      this.layout.splice(index, 1);
    },
  },
};
</script>
<style lang="less" scoped>
.pso-desk-editor {
  .pso-desk-editor__header {
    padding: 0 0 10px 0;
    text-align: right;
  }
  .pso-desk-editor__body {
    background-color: #f7f8f9;
    min-height: 600px;
    .pso-desk-item {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
      font-size: 24px;
      &:hover {
        > i {
          display: block;
        }
      }
      > i {
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
        display: none;
      }
    }
  }
}
</style>
