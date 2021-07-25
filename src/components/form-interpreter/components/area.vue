<template>
  <pso-label :cpnt="cpnt">
    <el-cascader
      ref="cascader"
      clearable
      filterable
      v-if="show"
      :size="size"
      :props="props"
      v-model="proxy"
      :disabled="!cpntEditable"
      :popper-class="cascaderpopper"
      @expand-change="changeHandler"
      @visible-change="visibleHandler"
    ></el-cascader>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  data() {
    return {
      show: false,
      proxy: [],
      props: {
        multiple: false,
        value: "city_name",
        label: "city_name",
        lazy: true,
        lazyLoad: async (node, resolve) => {
          const { level } = node;
          let parent_id = level === 0 ? 0 : node.data.code_id;
          const ret = await this.API.getArea({ parent_id });
          let leaf = false;
          if (
            (level === 0 && this.cpnt.data._type === "province") ||
            (level === 1 && this.cpnt.data._type === "city") ||
            (level === 2 && this.cpnt.data._type === "county")
          ) {
            leaf = true;
          }
          ret.data.forEach((d) => this.$set(d, "leaf", leaf));
          resolve(ret.data);
        },
      },
    };
  },
  computed: {
    cascaderpopper() {
      return this.__isMobile__ ? "cascaderpopper" : "";
    },
  },
  watch: {
    proxy: {
      deep: true,
      handler(value) {
        if (this.props.multiple) {
          this.cpnt.data._val = value.map((d) => d.join("/")).join(",");
        } else {
          this.cpnt.data._val = value.join("/");
        }
      },
    },
  },
  created() {
    this.props.multiple = this.cpnt.data._saveType === "checkbox";
    if (this.cpnt.data._val) {
      const data = this.cpnt.data._val.split(",");
      if (this.props.multiple) {
        this.proxy = data.map((d) => d.split("/"));
      } else {
        this.proxy = data[0].split("/");
      }
    }
    this.$nextTick(() => (this.show = true));
  },
  methods: {
    changeHandler() {
      if (this.__isMobile__) {
        this.$nextTick(() => {
          $(".cascaderpopper").scrollLeft(500);
        });
      }
    },
    visibleHandler(visible) {
      if (visible && this.__isMobile__) {
        this.$nextTick(() => {
          $(".cascaderpopper").scrollLeft(0);
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
@{deep} {
  .el-form-item__label {
    line-height: 20px;
    color: #000;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
<style lang="less">
.cascaderpopper {
  max-width: 100%;
  left: 0 !important;
  overflow: auto;
}
</style>