<template>
  <span class="modifier-flag" v-html="flag"></span>
</template>
<script>
export default {
  props: {
    field: Object,
    data: Object,
    store: Object,
  },
  data() {
    return {
      flag: "",
    };
  },
  computed: {
    tagVal() {
      return this.data[this.field._fieldValue];
    },
    checkFlag() {
      return this.store.checkFlag(this.field.field_name, this.data);
    },
  },
  async created() {
    if (this.checkFlag) {
      this.flag = this.store.formatListVal(this.data, this.field);
    } else if (/\S+_x$/.test(this.field.field_name) && this.data[this.field.field_name]) {
      this.flag = this.data[this.field.field_name];
    } else {
      if (this.tagVal && this.field._source) {
        let list = [];
        if (["tree", "folder"].includes(this.field._source)) {
          const nodes = (await this.API.trees({ data: { dimen: 5 } })).data.tagtree;
          nodes.forEach((n) => {
            if (this.tagVal.indexOf(n.node_id) !== -1) list.push(n.node_display);
          });
        } else {
          const source = this.tagVal.split(",");
          for (let tag_no of source) {
            const ret = await this.API.getTagAttribute({ tag_no }, { showMsg: false });
            if (ret && ret.data && ret.data.data) {
              if (this.field._fieldFormat === "flag" && ret.data.data.tag_rule) {
                this.flag += this.store.getColorTagEl(ret.data.data.tag_rule);
              } else {
                list.push(ret.data.data.tag_name);
              }
            }
          }
        }
        if (list.length) {
          this.flag = list.join(",");
        }
      } else {
        this.flag = this.tagVal;
      }
    }
  },
};
</script>