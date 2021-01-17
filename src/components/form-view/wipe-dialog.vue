<template>
  <el-dialog width="400px" title="确认删除数据" :visible.sync="store.wipeProxy.visible" append-to-body>
    <div style="margin-bottom: 20px">请输入“DELETE”确认删除{{ store.wipeProxy.tip }}数据</div>
    <el-input size="small" v-model="store.wipeProxy.check" autocomplete="off"></el-input>
    <slot></slot>
    <div slot="footer">
      <el-button size="mini" @click="store.wipeProxy.visible = false">取 消</el-button>
      <el-button size="mini" :loading="store.wipeProxy.doing" :disabled="store.wipeProxy.doing" type="primary" @click="goWipe">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    store: Object,
  },
  methods: {
    goWipe() {
      if (this.store.wipe) {
        this.store.wipe();
      } else {
        this.$emit("wipe");
      }
    },
  },
};
</script>