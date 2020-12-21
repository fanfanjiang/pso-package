<template>
  <div class="grid-panel">
    <div class="grid-panel-tabs">
      <button-tabs v-model="curTab" :data="TABS"></button-tabs>
      <el-button type="text" @click="saveCpnt" :loading="cpnt.store.saving">保存模块</el-button>
    </div>
    <div class="grid-panel-body">
      <data-source
        v-if="curTab === 0"
        :source="cpnt.urine.child_data"
        :column="cpnt.urine.child_content"
        :id="cpnt.urine.child_id"
      ></data-source>
      <common-panel v-if="curTab === 1" :cpnt="cpnt">
      </common-panel>
    </div>
  </div>
</template> 
<script>
import DataSource from "../../plugin-module/data-source";
import CommonPanel from "../common-panel";

import { BaseMixin } from "../mixin";
export default {
  components: { DataSource, CommonPanel },
  mixins: [BaseMixin],
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>