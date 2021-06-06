<template>
  <div class="pso-wf-executor__emptys">
    <multiple-users
      :users="store.data.reviews"
      ufield="empties"
      title="请选择该步骤的审核人"
      item-title="step_name"
      @close="closeHandler"
      @select="selectHandler"
      @confirm="confirmHandler"
    ></multiple-users>
  </div>
</template>
<script>
import MultipleUsers from "../../multiple-users";
import { op } from "../mixin";

export default {
  components: { MultipleUsers },
  mixins: [op],
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    selectHandler({ step_code }) {
      if (step_code) {
        this.store.markNode(step_code);
      }
    },
    closeHandler() {
      this.store.markNode();
      this.store.showEmptys = false;
    },
    async confirmHandler() {
      await this.nextStep(this.REVIEW_OP_TYPE.confirm.type, true, false);
    },
  },
};
</script>