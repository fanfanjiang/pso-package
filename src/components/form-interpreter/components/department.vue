<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required">
    <div style="display:flex">
      <div class="pso-form-dept-selectedlist" v-if="!loading&&proxy.list.length">
        <el-tag
          v-for="item in proxy.list"
          :key="item.node_id"
          :closable="cpnt.store.editable&&!cpnt.data._read"
          @close="handleDelSelection(item)"
        >{{item.node_display}}</el-tag>
      </div>
      <pso-skeleton v-if="loading" :lines="1"></pso-skeleton>
      <pso-picker-dept
        v-if="cpnt.store.editable&&!cpnt.data._read"
        ref="selector"
        :show="show"
        :pattern="cpnt.data._type"
        @cancel="show=false"
        @confirm="handleAddSelection"
      >
        <el-button size="mini" icon="el-icon-plus" circle></el-button>
      </pso-picker-dept>
    </div>
  </el-form-item>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type", idName: "node_id" }), cpntMixin],
  data() {
    return {
      loading: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type,
      },
    };
  },
  watch: {
    "proxy.list"(val) {
      if (val && val.length) {
        this.cpnt.data._val = _.map(val, "node_id").join(",");
      } else {
        this.cpnt.data._val = "";
      }
    },
  },
  async created() {
    const orgTree = await this.API.getOrgTree();
    if (this.cpnt.data._val) {
      this.loading = true;
      const list = [];
      for (let node_id of this.cpnt.data._val.split(",")) {
        const node = _.find(orgTree, { node_id: parseInt(node_id) });
        if (node) list.push(node);
      }
      this.handleAddSelection(list);
      this.loading = false;
    } else if (this.cpnt.data._defaultValType === "current") {
    } else {
      this.proxy.valList = [];
    }
  },
};
</script>
<style lang="less" scoped>
.pso-form-dept-selectedlist {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
</style>