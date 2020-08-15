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
            <el-form-item label="状态约束">
              <el-select v-model="t.status" size="mini" clearable multiple>
                <el-option
                  v-for="sts in statusCfg[t.id]"
                  :key="sts.value"
                  :label="sts.name"
                  :value="sts.value"
                ></el-option>
              </el-select>
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
      activeTab: "",
      statusCfg: {},
    };
  },
  computed: {
    asstables() {
      return this.store.search({ options: { componentid: "asstable" }, onlyData: true });
    },
  },
  async created() {
    this.asstables.forEach((t) => {
      const exist = _.find(this.data, { id: t._fieldValue });
      let defData = { name: t._fieldName, id: t._fieldValue, authCfg: [], searchType: "", status: [], authable: false };
      if (exist) {
        Object.assign(exist, { ...defData, ...exist });
      } else {
        this.data.push(defData);
      }
    });

    for (let ast of this.asstables) {
      const ret = await this.API.getTreeNode({ code: ast._option });
      const astCfg = ret.data.data;
      if (astCfg.status_config) {
        this.statusCfg[ast._fieldValue] = JSON.parse(astCfg.status_config);
      }
    }

    if (this.data.length) {
      this.activeTab = this.data[0].id;
    }
  },
};
</script>