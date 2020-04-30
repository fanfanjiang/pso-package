<template>
  <common-panel :cpnt="cpnt" info="可以选择部门插入表单" :needPlaceholder="true" :needDefaultValue="false">
    <el-form-item label="选择类型">
      <el-radio v-model="cpnt.data._type" label="radio">单选</el-radio>
      <el-radio v-model="cpnt.data._type" label="checkbox">多选</el-radio>
    </el-form-item>
    <el-form-item label="默认类型">
      <el-radio v-model="cpnt.data._defaultValType" label="choose">手动选择</el-radio>
      <el-radio v-model="cpnt.data._defaultValType" label="current">当前用户所属部门</el-radio>
    </el-form-item>
    <el-form-item label="默认值" v-if="!isSetCurrent" v-loading="loading">
      <pso-picker-dept
        :appid="cpnt.store.appid"
        ref="selector"
        :show="show"
        :pattern="cpnt.data._type"
        @cancel="show=false"
        @confirm="handleAddSelection"
      ></pso-picker-dept>
      <div :key="cpnt.fid">
        <el-tag
          v-for="item in proxy.defaultList"
          :key="item.node_id"
          closable
          @close="handleDelSelection(item)"
        >{{item.node_name}}</el-tag>
      </div>
    </el-form-item>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";
import { selectionMixin } from "@/mixin/common";

export default {
  props: ["cpnt"],
  mixins: [selectionMixin({ baseObjName: "proxy", dataListName: "defaultList", typeName: "type", idName: "node_id" })],
  components: {
    commonPanel
  },
  data() {
    return {
      loading: false,
      proxy: {
        defaultList: [],
        type: this.cpnt.data._type
      }
    };
  },
  computed: {
    isSetCurrent() {
      return this.cpnt.data._defaultValType === "current";
    }
  },
  watch: {
    "cpnt.data._type": {
      handler(val) {
        this.proxy.type = val;
      }
    },
    "cpnt.data._defaultValType": {
      handler(val) {
        if (val === "current") {
          this.proxy.defaultList = [];
        }
      }
    },
    "proxy.defaultList": {
      deep: true,
      handler(val) {
        this.cpnt.data._defaultValue = val.map(item => item.node_id).join(",");
      }
    }
  },
  async created() {
    if (!this.isSetCurrent && this.cpnt.data._defaultValue) {
      this.loading = true;
      const ret = await this.API.trees({ data: { node_id: "3", appid: "3", node_dimen: "NODEDIMEN02" } });
      for (let node_id of this.cpnt.data._defaultValue.split(",")) {
        const node = _.find(ret.data, { node_id: parseInt(node_id) });
        if (node) this.proxy.defaultList.push(node);
      }
      this.loading = false;
    }
  }
};
</script>
