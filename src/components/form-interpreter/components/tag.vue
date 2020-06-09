<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <div class="pso-form-selectedlist" v-if="!loading&&proxy.list.length">
      <el-tag
        v-for="item in proxy.list"
        :key="item[tagIdName]"
        :closable="cpnt.store.editable&&!cpnt.data._read"
        @close="handleDelSelection(item)"
      >{{item[tagDisplayName]}}</el-tag>
    </div>
    <pso-skeleton v-if="loading" :lines="1"></pso-skeleton>
    <pso-picker-tag
      v-if="cpnt.store.editable&&!cpnt.data._read"
      ref="selector"
      :show="show"
      :tree-option="cpnt.data._treeOptions"
      :pattern="cpnt.data._type"
      :source="cpnt.data._source"
      @cancel="show=false"
      @confirm="handleTagAdd"
    ></pso-picker-tag>
  </el-form-item>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" }), cpntMixin],
  data() {
    return {
      loading: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type
      }
    };
  },
  computed: {
    tagIdName() {
      return this.cpnt.data._source === "tree" ? "node_id" : "tag_no";
    },
    tagDisplayName() {
      return this.cpnt.data._source === "tree" ? "node_display" : "tag_name";
    }
  },
  watch: {
    "proxy.list"(val) {
      if (val && val.length) {
        this.cpnt.data._val = _.map(val, this.tagIdName).join(",");
      } else {
        this.cpnt.data._val = "";
      }
    }
  },
  async created() {
    this.resetPicker({ idName: this.tagIdName });

    if (this.cpnt.data._val && typeof this.cpnt.data._val === "string") {
      this.loading = true;
      let tagData = this.cpnt.data._val.split(",");
      let ret = { data: [] };
      let idName = "";
      if (this.cpnt.data._source === "tree") {
        ret = await this.API.trees({ data: { dimen: 5 } });
        idName = "node_id";
        tagData = tagData.map(val => parseInt(val));
      } else {
        ret = await this.API.tag({ data: { keys: JSON.stringify({}), page: 0, limit: 9999999 } });
        idName = "tag_no";
      }
      ret.data.forEach(item => {
        if (tagData.indexOf(item[idName]) !== -1) this.proxy.list.push(item);
      });

      this.loading = false;
    }

    this.dispatch("PsoformInterpreter", "cpnt-tag-changed", { cpnt: this.cpnt, value: this.cpnt.data._val, proxy: this.proxy });
  },
  methods: {
    handleTagAdd(data) {
      this.handleAddSelection(data);
      this.handleCopy(this.proxy.list[this.proxy.list.length - 1]);
    },
    handleCopy(tobeCopy) {
      if (!this.cpnt.data._copy || this.cpnt.data._source !== "data") return;
      this.cpnt.store._forEach(cpnt => {
        for (let key in tobeCopy) {
          if (cpnt.data._fieldValue === key) {
            cpnt.data._val = tobeCopy[key];
          }
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.pso-form-selectedlist {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
</style>