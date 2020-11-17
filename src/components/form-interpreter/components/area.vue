<template>
  <pso-label :cpnt="cpnt">
    <el-cascader ref="cascader" size="small" v-if="show" v-model="proxy" :props="props" :disabled="!cpntEditable" filterable></el-cascader>
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
      const proxy = [];
      if (this.props.multiple) {
        this.proxy = data.map((d) => d.split("/"));
      } else {
        this.proxy = data[0].split("/");
      }
    }
    this.$nextTick(() => (this.show = true));
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