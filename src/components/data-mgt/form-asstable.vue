<template>
  <div>
    <template v-if="data.length">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane :label="t.name" :name="t.id" v-for="t in data" :key="t.id">
          <pso-title>基本参数</pso-title>
          <el-form ref="form" label-width="120px" label-position="left">
            <el-form-item label="是否开启权限">
              <el-switch v-model="t.authable" size="mini"></el-switch>
            </el-form-item>
            <el-form-item label="查询类型">
              <el-input v-model="t.searchType" size="mini"></el-input>
            </el-form-item>
          </el-form>
          <pso-title>权限参数</pso-title>
          <view-auth :data="t.authCfg" :def-form="store.data_code"></view-auth>
        </el-tab-pane>
      </el-tabs>
    </template>
    <pso-empty v-else text="无子表"></pso-empty>
  </div>
</template>
<script>
import viewAuth from "../menu-mgt/view";
export default {
  props: ["store", "data"],
  components: { viewAuth },
  data() {
    return {
      activeTab: ""
    };
  },
  computed: {
    asstables() {
      return this.store.search({ options: { componentid: "asstable" }, onlyData: true });
    }
  },
  created() {
    this.asstables.forEach(t => {
      const exist = _.find(this.data, { id: t._fieldValue });
      let defData = { name: t._fieldName, id: t._fieldValue, authCfg: [], searchType: "", authable: false };
      if (exist) {
        Object.assign(exist, { ...defData, ...exist });
      } else {
        this.data.push(defData);
      }
    });
    if (this.data.length) {
      this.activeTab = this.data[0].id;
    }
  }
};
</script>