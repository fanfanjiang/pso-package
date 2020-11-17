<template>
  <div class="wf-panel-branchitem">
    <data-filter
      :fields-options="wfDesigner.fieldsOptions"
      :condition="node.conditionMap"
      :auto-trans="false"
      v-model="node.conditionMap"
    ></data-filter>
  </div>
</template>
<script>
import { mapState } from "vuex";
import DataFilter from "../../data-filter";

export default {
  props: ["node"],
  components: { DataFilter },
  computed: {
    ...mapState(["wfDesigner"]),
  },
};
</script>
<style lang="less" scoped>
.wf-panel-branchitem {
  .wf-panel-branchitem__and {
    margin-top: 10px;
  }
  .wf-panel-branchitem__andbtn {
    margin-top: 10px;
  }
  .wf-panel-branchitem__orbtn {
    margin-top: 10px;
  }
  .wf-panel-branchitem__picker {
    display: flex;
    > div {
      flex: 1;
    }
  }
  .wf-panel-branchitem__del {
    font-size: 20px;
    color: rgb(182, 182, 182);
    margin-left: 5px;
    padding-top: 5px;
    height: 30px;
    cursor: pointer;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #f56c6c;
      transition: color 0.2s ease-in-out;
    }
  }
}
</style>