<template>
  <pso-label :cpnt="cpnt">
    <div style="display: flex; align-items: center">
      <div class="pso-form-dept-selectedlist" v-if="!loading && proxy.list.length">
        <el-tag
          v-for="item in proxy.list"
          :key="item.node_id"
          :closable="cpnt.store.editable && !cpnt.data._read"
          @close="handleDelSelection(item)"
          >{{ item.node_display }}</el-tag
        >
      </div>
      <pso-skeleton v-if="loading" :lines="1" :s-style="{ width: '120px', padding: '0 5px' }"></pso-skeleton>
      <pso-picker-dept
        v-if="cpnt.store.editable && !cpnt.data._read"
        ref="selector"
        :pattern="cpnt.data._type"
        @confirm="handleAddSelection"
      >
        <el-button size="mini" icon="el-icon-plus" circle></el-button>
      </pso-picker-dept>
    </div>
  </pso-label>
</template>
<script>
import { pickerMixin } from "../../../mixin/picker";
import cpntMixin from "../mixin";
import { mapState } from "vuex";

export default {
  mixins: [pickerMixin({ baseObjName: "proxy", dataListName: "list", typeName: "type", idName: "node_id" }), cpntMixin],
  data() {
    this.orgs = [];
    return {
      loading: false,
      initialized: false,
      proxy: {
        list: [],
        type: this.cpnt.data._type,
      },
      cachedIds: [],
    };
  },
  computed: {
    ...mapState(["base"]),
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
    this.loading = true;

    if (this.cpnt.data._bindUser) {
      this.$on("cpnt-value-changed", ({ cpnt, proxy }) => {
        if (cpnt.data._fieldValue === this.cpnt.data._bindUser && proxy) {
          if (proxy.list.length) {
            this.setDataByIds([proxy.list[0].node_id]);
          } else {
            this.proxy.list = [];
          }
        }
      });
    }

    this.orgs = await this.API.getOrgTree();
    this.initialized = true;
    if (this.cpnt.data._val) {
      this.setDataByIds(this.cpnt.data._val.split(","));
    } else if (this.cpnt.data._defaultValType === "current" && this.base.user && this.base.user.deptid) {
      this.setDataByIds([this.base.user.deptid]);
    } else {
      this.proxy.valList = [];
    }
    this.loading = false;
    this.dispatch("PsoformInterpreter", "cpnt-dept-initialized", { cpnt: this.cpnt, value: this.cpnt.data._val, proxy: this.proxy });
    this.handleCached();
  },
  methods: {
    async handleCached() {
      if (this.cachedIds.length) {
        await this.setDataByIds(this.cachedIds);
        this.cachedIds = [];
      }
    },
    async setDataByIds(depts) {
      if (depts && typeof depts === "string") {
        depts = depts.split(",");
      }
      const list = [];
      if (!this.initialized) {
        this.cachedIds = this.cachedIds.concat(depts);
        return;
      }
      for (let node_id of depts) {
        const node = _.find(this.orgs, { node_id: parseInt(node_id) });
        if (node) list.push(node);
      }
      this.handleAddSelection(list);
    },
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