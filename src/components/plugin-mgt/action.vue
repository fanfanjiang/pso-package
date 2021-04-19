<template>
  <div>
    <el-button size="mini" type="primary" @click="addHandler">新增配置</el-button>
    <div style="margin-top: 15px" v-for="(d, i) in data" :key="i">
      <great-panel>
        <template #header>
          <i class="el-icon-edit-outline"></i>
          <span>设置项（每一个配置项对应一个表单）</span>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="delHandler(i)"></el-button>
        </template>
        <action-item :data="d" :column="column"></action-item>
      </great-panel>
    </div>
  </div>
</template>
<script>
import { STATIC_ACTION_FIELDS } from "../../const/sys";
import { formatJSONList } from "../../utils/util";
import ActionItem from "./action-item";
import GreatPanel from "../great-panel";
export default {
  components: { ActionItem, GreatPanel },
  props: {
    data: Array,
    column: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    formatJSONList(this.data, STATIC_ACTION_FIELDS);
  },
  methods: {
    addHandler() {
      this.data.push(_.cloneDeep(STATIC_ACTION_FIELDS));
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
  },
};
</script>