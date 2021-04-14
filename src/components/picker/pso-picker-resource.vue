<template>
  <el-popover
    :visible-arrow="false"
    popper-class="pso-popover-fs"
    transition="el-zoom-in-top"
    placement="top-end"
    width="460"
    @show="opened = true"
    @after-leave="afterHandler"
    v-model="show"
  >
    <div class="pso-picker" v-if="opened">
      <div style="height: 330px">
        <knowl :params="{ data_type }" :opable="false" :treeable="false" @select="selectHandler"></knowl>
      </div>
      <div class="pso-picker__controller">
        <el-button @click="show = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-plus" plain size="mini">选择资源</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
import Knowl from "../knowl";

export default {
  components: { Knowl },
  props: {
    pattern: {
      type: String,
      default: "radio",
    },
    data_type: {
      type: String,
      default: "sysdoc",
    },
  },
  data() {
    return {
      opened: false,
      show: false,
      selected: [],
    };
  },
  methods: {
    selectHandler(data) {
      this.selected = data;
    },
    confirm() {
      this.$emit("confirm", this.selected);
      this.show = false;
    },
    afterHandler() {
      this.opened = false;
      this.selected = [];
    },
  },
};
</script>