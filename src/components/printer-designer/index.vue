<template>
  <div class="printer-designer" v-loading="initializing">
    <template v-if="!initializing">
      <div class="printer-designer-header">
        <pso-header title="打印模板" :backable="false">
          <template v-slot:btn>
            <el-button type="primary" size="small" icon="fa fa-floppy-o" :loading="saving" :disabled="saving" @click="formSaveHandler">
              保存
            </el-button>
          </template>
        </pso-header>
      </div>
      <div class="printer-designer-body"></div>
    </template>
  </div>
</template>
<script>
import PsoHeader from "../header";
import { formOp } from "../form-designer/mixin";
export default {
  mixins: [formOp],
  props: ["params"],
  components: { PsoHeader },
  data() {
    return {
      initializing: true,
    };
  },
  async created() {
    await this.makeFormStore(this.params.code);
    if (this.formStore) {
      const cpnts = this.formStore.search({ onlyData: true, options: { db: true } });
    }
    this.initializing = false;
  },
  methods: {},
};
</script>