<template>
  <div class="Lay-setting" v-loading="initializing">
    <div class="header">
      <el-tabs v-model="curFv">
        <el-tab-pane v-for="(d, i) in fvs" :key="i" :label="d.name" :name="d.fid"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="body">
      <div style="padding: 0">
        <pso-form-view v-if="formParams" v-bind="formParams" :params="formParams"></pso-form-view>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      curFv: "",
      formParams: null,
    };
  },
  computed: {
    fvs() {
      return this.params.multifv;
    },
  },
  watch: {
    curFv() {
      this.setParams();
    },
  },
  created() {
    if (this.fvs.length) {
      this.curFv = this.fvs[0].fid;
    }
  },
  methods: {
    setParams() {
      this.formParams = null;
      if (this.curFv) {
        const fv = _.find(this.fvs, { fid: this.curFv });
        const { opts } = fv;
        const params = {};
        if (opts) {
          for (let item of opts) {
            if (typeof params[item.field] === "undefined") {
              params[item.field] = item.value;
            }
          }
        }
        this.formParams = params;
      }
    },
  },
};
</script>