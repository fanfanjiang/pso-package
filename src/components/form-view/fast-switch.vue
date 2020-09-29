<template>
  <div class="pso-view-switch" v-if="show">
    <el-divider direction="vertical" v-if="divider"></el-divider>
    <template v-if="showtype === 'tag'">
      <el-tag v-if="showAll" size="medium" disable-transitions @click="doSwitch()" :effect="tagEffect(undefined)">全部</el-tag>
      <template v-for="(d, i) in options">
        <el-badge
          v-if="showBadge(d.total)"
          :key="i"
          :hidden="!showBadge(d.total)"
          :value="d.total"
          :type="i > 3 ? 'info' : 'primary'"
          :max="badgeMax"
          class="item"
        >
          <el-tag size="medium" disable-transitions :effect="tagEffect(d)" @click="doSwitch(d)">{{ d.name }}</el-tag>
        </el-badge>
      </template>
    </template>
    <template v-else-if="showtype === 'select'">
      <el-select v-model="proxy" :placeholder="makeText('请选择')" size="mini" @change="selectHandler">
        <el-option :label="makeText('全部')" value="all"></el-option>
        <el-option v-for="(d, i) in options" :key="i" :label="d.name" :value="d.value"></el-option>
      </el-select>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    store: Object,
    switch: String,
    model: String,
    skey: String,
    showtype: {
      type: String,
      default: "tag",
    },
    badgeMax: {
      type: Number,
      default: 99,
    },
    divider: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      proxy: "all",
    };
  },
  computed: {
    show() {
      return (this.showtype === "tag" && this.showAll) || (this.showtype === "select" && this.options.length);
    },
    options() {
      return this.store[this.switch];
    },
    currunt() {
      return this.store[this.model];
    },
    showAll() {
      return _.sumBy(this.options, (item) => parseInt(item.total || 0)) > 0;
    }
  },
  methods: {
    showBadge(num) {
      return num && num !== "0";
    },
    tagEffect(data) {
      return this.currunt == data ? "dark" : "plain";
    },
    doSwitch(data) {
      this.store.fetchCuzFastSwtich(this.model, this.skey, data);
    },
    makeText(text) {
      return `${this.text}${text}`;
    },
    selectHandler(value) {
      let data;
      if (value !== "all") {
        data = _.find(this.options, { value });
        if (typeof value === "string" && !data) {
          data = _.find(this.options, { value: parseInt(value) });
        }
      }
      this.doSwitch(data);
    },
  },
};
</script>