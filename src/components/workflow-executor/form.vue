<template>
  <pso-form-interpreter
    @value-change="formChangeHandler"
    @data-loaded="handleFormDataLoaded"
    ref="formImage"
    v-if="store.cfg.map_data_code&&!store.configing"
    :form-id="store.cfg.map_data_code"
    :data-id="instanceId"
    :data-default="store.defForm"
    :editable="isFormWriteable"
    :copy-mode="store.copy"
  ></pso-form-interpreter>
</template>
<script>
import PsoFormInterpreter from "../form-interpreter";
import emitter from "../../mixin/emitter";

export default {
  mixins: [emitter],
  components: { PsoFormInterpreter },
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    instanceId() {
      return this.store.data.instanceId || (this.store.copy ? this.store.copyInstanceId : "");
    },
    isFormWriteable() {
      return this.store.curStep && this.store.curStep.atype === "form";
    },
  },
  methods: {
    async handleFormDataLoaded(formStore) {
      this.store.setForm({ formImage: this.$refs.formImage, formStore });
      const maps = formStore.cpntsMap;
      for (let key in maps) {
        if (maps[key].data._fieldValue) {
          await this.formChangeHandler({ cpnt: maps[key], value: maps[key].data._val });
        }
      }
      this.dispatch("PsoWfExecutorBox", "initialized", this.store);
    },
    formChangeHandler(data) {
      // console.log(data);
      this.store.setTableVal(data);
    },
  },
};
</script>