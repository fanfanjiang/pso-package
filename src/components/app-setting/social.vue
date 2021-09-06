<template>
  <div v-loading="initializing">
    <social-item v-for="(d, i) in instances" :key="i" :data="d" @save="save($event, d)"></social-item>
  </div>
</template>
<script>
import SocialItem from "./social-item";
import { COLUMN } from "./const";
const SOCIAL = [
  {
    map_key0: "wechatweb",
    map_key1: "微信公众号登录",
    map_key2: "0",
    map_key3: "2",
    map_key6: "/sign/wechat",
    map_key7: "/static/app/img/wechat.png",
    map_key8: "1",
  },
  {
    map_key0: "wechat",
    map_key1: "微信WEB登录",
    map_key2: "0",
    map_key3: "1",
    map_key6: "/sign/wechatweb",
    map_key7: "/static/app/img/wechat.png",
    map_key8: "1",
  },
  {
    map_key0: "qq",
    map_key1: "QQ登录",
    map_key2: "0",
    map_key3: "1",
    map_key6: "/sign/qq",
    map_key7: "/static/app/img/qq.png",
    map_key8: "1",
  },
  {
    map_key0: "weibo",
    map_key1: "微博登录",
    map_key2: "0",
    map_key3: "1",
    map_key6: "/sign/weibo",
    map_key7: "/static/app/img/weibo.png",
    map_key8: "1",
  },
  {
    map_key0: "onecard",
    map_key1: "法人一证通登录",
    map_key2: "0",
    map_key3: "1",
    map_key6: "/sign/onecard",
    map_key7: "/static/app/img/onecard.png",
    map_key8: "1",
  },
];
export default {
  components: { SocialItem },
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
      const ret = await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 6, type: 1 } }) });
      for (let item of SOCIAL) {
        const exist = _.find(ret.data, { map_key0: item.map_key0 });
        this.instances.push({
          ...COLUMN,
          ...item,
          optype: exist ? 1 : 0,
          config_type: 6,
          ...exist,
          ...{
            map_key0: item.map_key0,
            map_key1: item.map_key1,
            map_key6: item.map_key6,
            map_key7: item.map_key7,
          },
        });
      }
      this.initializing = false;
    },
    async save(open, data) {
      if (open && (!data.map_key4 || !data.map_key5)) {
        return this.$message("请完善信息");
      }

      this.initializing = true;
      const ret = await this.API.updateSysConfig(data);
      if (open) {
        this.ResultNotify(ret);
      }
      this.initializing = false;
    },
  },
};
</script>