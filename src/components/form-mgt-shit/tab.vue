<template>
  <div class="pso-tabs">
    <div class="pso-tabs-header">
      <div class="pso-tabs-title">
        <i class="el-icon-s-promotion"></i>
        <span>{{ title }}</span>
      </div>
      <div class="pso-tabs-r">
        <el-button size="mini" icon="el-icon-plus" circle @click="$emit('add')"></el-button>
      </div>
    </div>
    <el-tabs tab-position="left" v-model="curTab">
      <el-tab-pane v-for="(d, i) in data" :label="d[nf]" :name="d[kf]" :key="i">
        <div class="pso-tabs-item" slot="label">
          <span>{{ d[nf] }}</span>
          <div class="pso-tabs-item__ctrl" v-if="d.deleteable || deleteable">
            <el-popconfirm title="你确定要删除吗？" @confirm="$emit('remove', { d, i })">
              <i slot="reference" class="el-icon-delete"></i>
            </el-popconfirm>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    title: String,
    data: Array,
    nf: {
      type: String,
      default: "name",
    },
    kf: {
      type: String,
      default: "id",
    },
    deleteable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      curTab: "",
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  watch: {
    curTab: {
      handler(val, oldVal) {
        this.$emit("change", val);
      },
    },
    value: {
      handler(val, oldVal) {
        this.curTab = val;
      },
    },
  },
  created() {
    this.curTab = this.value;
  },
};
</script>