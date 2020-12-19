<template>
  <div class="grid-panel">
    <div class="grid-panel-tabs">
      <button-tabs v-model="curTab" :data="TABS"></button-tabs>
      <el-button type="text" @click="saveCpnt" :loading="cpnt.store.saving">保存模块</el-button>
    </div>
    <div class="grid-panel-body">
      <data-source v-if="curTab === 0" :source="cpnt.urine.child_data" :id="cpnt.urine.child_id"></data-source>
    </div>
  </div>
</template> 
<script>
import DataSource from "../data-source";
import { BaseMixin } from "../mixin";
export default {
  components: { DataSource },
  mixins: [BaseMixin],
};
</script>