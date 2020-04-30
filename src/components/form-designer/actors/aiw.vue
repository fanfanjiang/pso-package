<template>
  <div class="actor-aiw">
    <common-actor :cpnt="cpnt">
      <span>{{moneyWords}}</span>
    </common-actor>
  </div>
</template>
<script>
import commonActor from "../common/common-actor";
const MoneyWords = require("../../../utils/sumInWords");
export default {
  name: "pso-aiw-actor",
  props: ["cpnt"],
  components: {
    commonActor
  },
  computed: {
    moneyWords() {
      if (this.cpnt.data._option) {
        const val = this.cpnt.store.search({ options: { fid: this.cpnt.data._option } }).data._defaultValue;
        if (val) {
          try {
            return MoneyWords.cn.toMoney(val);
          } catch (error) {
            return "";
          }
        }
      }
      return "";
    }
  }
};
</script>

