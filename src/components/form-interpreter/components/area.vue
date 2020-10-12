<template>
  <pso-label :cpnt="cpnt">
    <el-cascader size="small" v-if="show" v-model="proxy" :props="props" :disabled="!cpntEditable" filterable></el-cascader>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  data() {
    return {
      show: true,
      proxy: [],
      props: {
        value: "city_name",
        label: "city_name",
        lazy: true,
        lazyLoad: async (node, resolve) => {
          const { level } = node;
          let parent_id = level === 0 ? 0 : node.data.code_id;
          const ret = await this.API.getArea({ parent_id });
          if (
            (level === 0 && this.cpnt.data._type === "province") ||
            (level === 1 && this.cpnt.data._type === "city") ||
            (level === 2 && this.cpnt.data._type === "county")
          ) {
            ret.data.forEach((item) => (item.leaf = true));
          }
          resolve(ret.data);
        },
      },
    };
  },
  watch: {
    "cpnt.data._type"() {
      this.show = false;
      this.$nextTick(() => (this.show = true));
    },
    proxy: {
      deep: true,
      handler(value) {
        this.cpnt.data._val = value.join("/");
      },
    },
  },
  created() {
    if (this.cpnt.data._val) {
      this.proxy = this.cpnt.data._val.split("/");
    }
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