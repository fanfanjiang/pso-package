<template>
  <div :class="viewClass">
    <div class="pso-view-extend">
      <shit-tab title="状态配置" :deleteable="false" :addable="false" :data="TAB" v-model="curTab"></shit-tab>
    </div>
    <div class="pso-view-body" style="padding: 0 0 100px 15px;position: relative">
      <status-designer v-if="curTab === '0'" :code="code" :data="status" :fields="fields"></status-designer>
      <status-designer v-if="curTab === '1'" :code="code" :data="stage" :fields="fields"></status-designer>
      <form-submit v-if="curTab === '2'" :code="code" :data="subdata"></form-submit>
      <shit-save @save="$emit('save')"></shit-save>
    </div>
  </div>
</template>
<script>
import StatusDesigner from "./status-designer";
import FormSubmit from "./form-submit";
import { MgtMixin } from "../../mixin/view";
import ShitTab from "./tab";
import ShitSave from "./save.vue";
const TAB = [
  { name: "状态", id: "0" },
  { name: "阶段", id: "1" },
  { name: "提交", id: "2" },
];
export default {
  mixins: [MgtMixin],
  components: { ShitTab, StatusDesigner, ShitSave, FormSubmit },
  props: {
    fields: Array,
    code: String,
    status: Array,
    stage: Array,
    subdata: Array,
  },
  data() {
    this.TAB = TAB;
    return {
      curTab: "0",
    };
  },
};
</script>