<template>
  <div v-loading="initializing">
    <el-form-item label="模板ID">
      <el-input size="small" v-model="data.map_key0" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="模板名称">
      <el-input size="small" v-model="data.map_key1" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="模板类型">
      <el-select size="mini" v-model="data.map_key2">
        <el-option label="微信" value="wechat"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="模板标识">
      <el-input size="small" v-model="data.map_key3" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="模板关联">
      <el-select size="mini" v-model="data.map_key4">
        <el-option v-for="(d, i) in relation" :key="i" :label="d.map_key1" :value="d.map_key0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="更多地址">
      <div>
        <el-button size="mini" @click="addHandler">添加</el-button>
        <el-button size="mini" @click="delHandler">删除</el-button>
      </div>
      <el-table size="mini" :data="proxy" style="width: 100%" @selection-change="selectHandler">
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="模板字段">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.source"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="模板字段">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.target">
              <el-option v-for="(d, i) in MSG_FIELDS" :key="i" :label="d.n" :value="d.v"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>
<script>
const MSG_FIELDS = [
  { n: "消息标题", v: "msg_title" },
  { n: "消息主体", v: "msg_body" },
  { n: "消息分类", v: "msg_type" },
  { n: "消息子类", v: "msg_sub_type" },
  { n: "发起人", v: "sender_name" },
  { n: "收件人", v: "user_name" },
  { n: "发送时间", v: "msg_time" },
];

export default {
  props: {
    data: Object,
  },
  data() {
    this.relation = [];
    this.MSG_FIELDS = MSG_FIELDS;
    return {
      initializing: false,
      showIconBox: false,
      proxy: [],
      selected: [],
    };
  },
  watch: {
    proxy: {
      deep: true,
      handler(value) {
        this.data.map_key9 = JSON.stringify(value);
      },
    },
  },
  async created() {
    this.initializing = true;
    this.relation = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 6, type: 1 } }) })).data;
    if (this.data.map_key9) {
      this.proxy = JSON.parse(this.data.map_key9);
    }
    this.initializing = false;
  },
  methods: {
    addHandler() {
      this.proxy.push({ source: "", target: "" });
    },
    selectHandler(data) {
      this.selected = data;
    },
    delHandler() {
      this.selected.forEach((t) => {
        this.proxy.splice(_.findIndex(this.proxy, t), 1);
      });
    },
  },
};
</script>
