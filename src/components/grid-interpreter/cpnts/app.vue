<template>
  <pso-grid-wrapper :cpnt="cpnt">
    <div class="pso-grid-app" v-if="!initializing">
      <a class="pso-grid-app__item" v-for="(d, i) in data" :href="d.map_key2" :key="i" target="_blank">
        <img v-if="d.url" :src="d.url" alt />
        <div>{{ d.map_key0 }}</div>
      </a>
    </div>
    <div v-else style="padding: 15px">
      <pso-skeleton :lines="3"></pso-skeleton>
    </div>
  </pso-grid-wrapper>
</template>
<script>
import { BaseMixin } from "../mixin";
export default {
  mixins: [BaseMixin],
  data() {
    return {
      initializing: true,
      data: [],
    };
  },
  async created() {
    this.initializing = true;
    const cfgRet = await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { type: 1, value: "31" } }) });
    for (let item of cfgRet.data) {
      if (item.map_key1) {
        item.map_key2 = item.map_key2.replace(/@uid@/g, this.$store.state.base.user.user_id);
        item.map_key2 = item.map_key2.replace(/@pwd@/g, this.$store.state.base.user.user_pwd);
        const ret = await this.API.file({ data: { ids: item.map_key1 }, method: "get" });
        this.$set(item, "url", ret.data[0].res_path);
      }
    }
    this.data = cfgRet.data;
    this.initializing = false;
  },
};
</script>
