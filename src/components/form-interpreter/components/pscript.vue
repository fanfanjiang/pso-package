<template>
  <el-form-item :label="cpnt.data._fieldName" :required="cpnt.data._required"></el-form-item>
</template>
<script>
import cpntMixin from "../mixin";
export default {
  mixins: [cpntMixin],
  data() {
    return {
      initializing: false,
      table: []
    };
  },
  created() {
      
  },
  methods: {
    async fetch() {
      this.initializing = true;
      //   const ret = await this.API.getPscriptData({});
      this.initializing = false;
    }
  }
};
</script>