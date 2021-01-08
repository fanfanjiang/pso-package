<template>
  <div>
    <div class="sign-social" v-if="!initializing && options.length">
      <div class="sign-social-item" v-for="(o, i) in options" :key="i">
        <a :href="`${APIURL}${o.map_key6}?state=${appid}`" @click="goSocial(o.map_key6)" v-if="o.map_key6">
          <img :src="o.map_key7" alt="icon" />
          <span>{{ o.map_key1 }}</span>
        </a>
      </div>
    </div>
    <pso-skeleton v-if="initializing" :lines="1"></pso-skeleton>
  </div>
</template>
<script>
export default {
  props: {
    appid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      initializing: true,
      data: [],
    };
  },
  computed: {
    options() {
      return this.data.filter((d) =>
        d.map_key2 === "1" && d.map_key3 === "0" ? true : this.__isMobile__ ? d.map_key3 === "2" : d.map_key3 === "1"
      );
    },
  },
  watch: {
    appid: {
      immediate: true,
      handler() {
        this.initialize();
      },
    },
  },
  methods: {
    async initialize() {
      this.initializing = true;
      this.data = (
        await this.API.getSysConfigNoauth({ appid: this.appid, keys: JSON.stringify({ config_type: { value: 6, type: 1 } }) })
      ).data;
      const ids = _.map(this.data, "map_key7");
      if (ids.length) {
        let files = [];
        if (this.appid) {
          const ret = await this.API.getFielsNoauth({ ids: ids.join(","), appid: this.appid });
          if (ret.success) {
            files = ret.data;
          }
        } else {
          files = this.data.map((d) => ({ res_path: "/static/app/img/wechat.png", res_id: d.map_key7 }));
        }
        files.forEach((d) => {
          const exist = _.find(this.data, { map_key7: d.res_id });
          if (exist) {
            exist.map_key7 = d.res_path;
          }
        });
      }
      this.initializing = false;
    },
    goSocial(spath) {
      window.location = `${this.APIURL}${spath}?state=${this.appid}`;
    },
  },
};
</script>