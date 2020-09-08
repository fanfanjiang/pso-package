<template>
  <pso-label :cpnt="cpnt">
    <div style="display:flex;align-items: center;">
      <div class="pso-form-selectedlist" v-if="!loading&&proxy.list.length">
        <el-tag
          v-for="item in proxy.list"
          :key="item[tagIdName]"
          :closable="cpnt.store.editable&&!cpnt.data._read"
          @close="handleDelSelection(item)"
        >{{item[tagDisplayName]}}</el-tag>
      </div>
      <pso-skeleton v-if="loading" :lines="1" :s-style="{width:'120px',padding:'0 5px'}"></pso-skeleton>
      <pso-picker-tag
        v-if="cpnt.store.editable&&!cpnt.data._read"
        ref="selector"
        :tree-option="cpnt.data._treeOptions"
        :pattern="cpnt.data._type"
        :source="cpnt.data._source"
        @confirm="handleTagAdd"
      >
        <el-button size="mini" icon="el-icon-plus" circle></el-button>
      </pso-picker-tag>
    </div>
  </pso-label>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type" }), cpntMixin],
  data() {
    this.tagTrees = [];
    this.tagCollection = [];
    return {
      loading: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type,
      },
    };
  },
  computed: {
    tagIdName() {
      return this.cpnt.data._source === "tree" ? "node_id" : "tag_no";
    },
    tagDisplayName() {
      return this.cpnt.data._source === "tree" ? "node_display" : "tag_name";
    },
  },
  watch: {
    "proxy.list"(val) {
      if (val && val.length) {
        this.cpnt.data._val = _.map(val, this.tagIdName).join(",");
      } else {
        this.cpnt.data._val = "";
      }
    },
  },
  async created() {
    this.resetPicker({ idName: this.tagIdName, reset: false });
    if (this.cpnt.data._val) {
      await this.setDataByIds(this.cpnt.data._val.split(","));
    } else {
      this.proxy.valList = [];
    }
    this.dispatch("PsoformInterpreter", "cpnt-tag-changed", { cpnt: this.cpnt, value: this.cpnt.data._val, proxy: this.proxy });
  },
  methods: {
    async setDataByIds(tagData) {
      this.loading = true;
      let ret = { data: [] };
      let idName = "";
      if (!this.tagTrees.length || !this.tagCollection.length) {
        await this.prepareData();
      }
      if (this.cpnt.data._source === "tree") {
        ret = this.tagTrees;
        idName = "node_id";
        tagData = tagData.map((val) => parseInt(val));
      } else {
        ret = this.tagCollection;
        idName = "tag_no";
      }
      const list = [];
      ret.data.forEach((item) => {
        if (tagData.indexOf(item[idName]) !== -1) list.push(item);
      });
      this.handleAddSelection(list);
      this.loading = false;
    },
    async prepareData() {
      this.tagTrees = await this.API.trees({ data: { dimen: 5 } });
      this.tagCollection = await this.API.tag({ data: { keys: JSON.stringify({}), page: 0, limit: 9999999 } });
    },
    handleTagAdd(data) {
      this.handleAddSelection(data);
      this.handleCopy(this.proxy.list[this.proxy.list.length - 1]);
    },
    handleCopy(tobeCopy) {
      if (!this.cpnt.data._copy || this.cpnt.data._source !== "data") return;
      this.cpnt.store._forEach((cpnt) => {
        for (let key in tobeCopy) {
          if (cpnt.data._fieldValue === key) {
            cpnt.data._val = tobeCopy[key];
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.pso-form-selectedlist {
  display: flex;
  flex-wrap: wrap;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
</style>