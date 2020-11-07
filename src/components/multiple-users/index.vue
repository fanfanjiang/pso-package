<template>
  <div class="multiple-users" ref="wrapper">
    <div class="multiple-users-header">
      <div class="multiple-users-title">
        <i class="el-icon-user-solid"></i>
        <span>{{ title }}</span>
      </div>
      <div class="multiple-users-close" @click="$emit('close')">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="multiple-users-body">
      <div :class="getClass(u)" v-for="(u, i) in users" :key="i" @click="selectHandler(u)">
        <div class="multiple-users__item-title" v-if="itemTitle">{{ u[itemTitle] }}</div>
        <mu-item :data="u" :ufield="ufield"></mu-item>
      </div>
    </div>
    <div class="multiple-users-footer">
      <el-button type="success" plain size="small" @click="$emit('confirm')">提交</el-button>
    </div>
  </div>
</template>
<script>
import MuItem from "./item";
import addEventListener from "../../utils/dom/addEventListener";
export default {
  components: { MuItem },
  props: {
    users: {
      type: Object,
      default: () => [],
    },
    ufield: String,
    title: String,
    itemTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    this.listener = null;
    return {
      selected: null,
    };
  },
  created() {
    this.listener = addEventListener(document, "click", (e) => {
      const exception = $(".multiple-users-exception").get(0);
      if (!this.$refs.wrapper.contains(e.target) && !(exception && exception.contains(e.target))) {
        this.$emit("close");
      }
    });
  },
  destroyed() {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  },
  methods: {
    getClass(item) {
      return {
        "multiple-users__item-wrapper__selected": this.selected === item,
        "multiple-users__item-wrapper": true,
      };
    },
    selectHandler(evt) {
      this.selected = evt;
      this.$emit("select", evt);
    },
  },
};
</script>