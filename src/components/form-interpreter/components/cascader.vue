<template>
  <pso-label :cpnt="cpnt">
    <el-cascader
      v-if="show"
      filterable
      clearable
      :size="size"
      :disabled="!cpntEditable"
      :props="props"
      v-model="proxy"
      :options="options"
    ></el-cascader>
  </pso-label>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  props: {
    cpnt: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      show: false,
      proxy: [],
    };
  },
  computed: {
    fromForm() {
      return this.cpnt.data._type === "2";
    },
    options() {
      return this.fromForm ? [] : this.cpnt.data._option;
    },
    bid() {
      return this.cpnt.data._id;
    },
    bpid() {
      return this.cpnt.data._parentId;
    },
    bname() {
      return this.cpnt.data._name;
    },
    checkStrictly() {
      return this.cpnt.data._checkStrictly === "1";
    },
    props() {
      if (this.fromForm) {
        return {
          value: "_optionValue",
          label: "_optionValue",
          children: "_option",
          leaf: "_leaf",
          checkStrictly: this.checkStrictly,
        };
      } else {
        return {
          multiple: false,
          value: this.bid,
          label: this.bname,
          lazy: true,
          checkStrictly: this.checkStrictly,
          lazyLoad: async (node, resolve) => {
            const { level } = node;
            const parent_id = level === 0 ? this.cpnt.data._initParentVal : node.data[this.bid];

            const ret = await this.API.form({
              data: {
                data_code: this.cpnt.data._source,
                leaf_auth: 4,
                keys: JSON.stringify({ [this.bpid]: { value: parent_id, type: 1 } }),
              },
            });

            ret.data.forEach((d) => this.$set(d, "leaf", level === this.cpnt.data._level - 1));
            resolve(ret.data);
          },
        };
      }
    },
  },
  watch: {
    proxy: {
      deep: true,
      handler(value) {
        this.cpnt.data._val = value.join(",");
        this.changeBindCnpt();
      },
    },
  },
  created() {
    this.setDataByIds(this.cpnt.data._val);
  },
  methods: {
    changeBindCnpt() {
      const target = this.cpnt.data._bindField;
      if (target) {
        const data = this.proxy;
        const store = this.cpnt.store;
        for (let k in target) {
          const index = parseInt(k);
          if (target[k]) {
            store.updateCpntManually(target[k], data[index - 1] || "", { bindId: this.bid, clear: true });
          }
        }
      }
    },
    setDataByIds(ids) {
      this.show = false;
      let list = [];
      if (Array.isArray(ids)) {
        list = ids;
      } else if (typeof ids === "string") {
        if (ids) {
          list = ids.split(",");
        }
      }
      this.proxy = list;
      this.$nextTick(() => (this.show = true));
    },
  },
};
</script>
