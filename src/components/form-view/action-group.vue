<template>
  <div class="view-data-fun__actions">
    <div v-for="(a, i) in finalActions" :key="i">
      <el-popconfirm
        v-if="a.mode === '2'"
        confirmButtonText="确定"
        cancelButtonText="取消"
        icon="el-icon-info"
        iconColor="red"
        title="你确认要执行吗？"
        @confirm="checkAction(a)"
      >
        <action-btn slot="reference" :action="a" :store="store" :data="data"></action-btn>
      </el-popconfirm>
      <action-btn v-else :action="a" :store="store" @click="checkAction(a)" :data="data"></action-btn>
    </div>
  </div>
</template>
<script>
import ActionBtn from "./action-btn";
export default {
  components: { ActionBtn },
  props: {
    store: Object,
    actions: Array,
    data: Array,
    location: {
      type: String,
    },
  },
  computed: {
    finalActions() {
      return this.actions || this.store.actionMGR.getActions(this.location);
    },
  },
  methods: {
    checkAction(action) {
      this.store.checkAction(action, this.data);
    },
  },
};
</script>
<style lang="less" scoped>
.view-data-fun__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    & + div {
      margin-left: 10px;
    }
  }
}
</style>