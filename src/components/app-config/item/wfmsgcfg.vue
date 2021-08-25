<template>
  <div v-loading="initializing">
    <el-form-item label="配置ID">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="配置名称">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="消息分类">
      <el-select size="mini" v-model="data.map_key2">
        <el-option v-for="(d, i) in msgMains" :key="i" :label="d.map_key1" :value="d.map_key0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="消息子类">
      <el-select size="mini" v-model="data.map_key3">
        <el-option v-for="(d, i) in msgSubProxy" :key="i" :label="d.map_key1" :value="d.map_key0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="提醒方式">
      <el-select size="mini" v-model="data.map_key4">
        <el-option v-for="(d, i) in NOTICE_WAY" :key="i" :label="d.n" :value="d.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="消息目标">
      <el-select multiple clearable size="mini" v-model="proxy">
        <el-option v-for="(d, i) in relation" :key="i" :label="d.map_key1" :value="d.map_key0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="到期处理方式">
      <el-select size="mini" v-model="data.map_key6">
        <el-option v-for="(d, i) in MSG_EXPIRE_HANDLER" :key="i" :label="d.n" :value="d.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="自发消息">
      <el-select size="mini" v-model="data.map_key7">
        <el-option label="是" value="1"></el-option>
        <el-option label="否" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否默认配置">
      <el-select size="mini" v-model="data.map_key8">
        <el-option label="是" value="1"></el-option>
        <el-option label="否" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联流程">
      <el-select multiple clearable size="mini" v-model="wfcode">
        <el-option v-for="(w, i) in workflows" :key="i" :label="w.node_display" :value="w.node_name"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
const NOTICE_WAY = [
  { v: "0", n: "默认" },
  { v: "1", n: "登录强制提醒" },
];
const MSG_EXPIRE_HANDLER = [
  { v: "0", n: "不处理" },
  { v: "1", n: "催发" },
  { v: "2", n: "直接关闭" },
];
export default {
  props: {
    data: Object,
  },
  data() {
    this.relation = [];
    this.NOTICE_WAY = NOTICE_WAY;
    this.MSG_EXPIRE_HANDLER = MSG_EXPIRE_HANDLER;
    this.msgMains = [];
    this.msgSubs = [];
    this.workflows = [];
    return {
      initializing: false,
      showIconBox: false,
      proxy: [],
      wfcode: [],
    };
  },
  computed: {
    msgSubProxy() {
      return this.msgSubs.filter((d) => d.map_key0 === this.data.map_key2);
    },
  },
  watch: {
    proxy: {
      deep: true,
      handler(value) {
        this.data.map_key5 = value.join(",");
      },
    },
    wfcode: {
      deep: true,
      handler(value) {
        this.data.map_key9 = value.join(",");
      },
    },
  },
  async created() {
    this.initializing = true;

    const data = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: "9,10", type: 4 } }) })).data;
    const grouped = _.groupBy(data, "config_type");
    if (grouped["9"]) {
      this.msgMains = grouped["9"];
    }
    if (grouped["10"]) {
      this.msgSubs = grouped["10"];
    }
    this.relation = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 16, type: 1 } }) })).data;
    this.workflows = await this.API.getWfTree();

    if (this.data.map_key5) {
      this.proxy = this.data.map_key5.split(",");
    }
    if (this.data.map_key9) {
      this.wfcode = this.data.map_key9.split(",");
    }
    this.initializing = false;
  },
  methods: {},
};
</script>
