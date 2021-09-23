<template>
  <div v-loading="initializing">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" v-for="(d, i) in instances" :key="i">
        <theme-item :data="d" @save="save($event, d)"></theme-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ThemeItem from "./theme-item";
import { COLUMN } from "./const";

const ID = "17";
const THEMES = require("../../theme-config.js");

export default {
  components: { ThemeItem },
  data() {
    return {
      instances: [],
    };
  },
  async created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.initializing = true;
      const ret = await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: ID, type: 1 } }) });
      for (let item of THEMES) {
        const exist = _.find(ret.data, { map_key0: item.name });
        this.instances.push({
          config_type: ID,
          optype: exist ? 1 : 0,
          ...COLUMN,
          map_key3: "1",
          ...exist,
          ...{
            map_key0: item.name,
            map_key1: item.label,
            variables: item.variables,
          },
        });
      }
      this.initializing = false;
    },
    async save(open, data) {
      this.initializing = true;
      const ret = await this.API.updateSysConfig(data);
      this.ResultNotify(ret);
      this.initializing = false;
    },
  },
};
</script>