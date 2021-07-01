<template>
  <div style="height: 100%">
    <pso-form-view v-bind="viewOptions" :params="viewOptions">
      <template v-slot:column="data">
        <el-button size="mini" type="primary" @click="test(data.row)">测试</el-button>
      </template>
    </pso-form-view>
  </div>
</template>
<script>
export default {
  props: {
    params: Object,
  },
  computed: {
    viewOptions() {
      return {
        cfgId: "dataSource",
        operate: true,
      };
    },
  },
  methods: {
    test(data) {
      console.log(data);
    },
  },
};
</script>