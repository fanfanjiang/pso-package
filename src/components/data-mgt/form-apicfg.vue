<template>
  <div style="margin-top: 20px">
    <button-tabs v-model="curTab" :data="TABS" :indexed="false"></button-tabs>
    <div>
      <form-iapicfg v-if="curTab === 'innerapi'" :data="data" :fields="fields" :code="code"></form-iapicfg>
      <form-oapicfg v-if="curTab === 'outerapi'"></form-oapicfg>
    </div>
  </div>
</template>
<script>
import ButtonTabs from "../button-tabs";
import FormIapicfg from "./form-iapicfg";
import FormOapicfg from "./form-oapicfg";
const TABS = [
  { label: "内部API", id: "innerapi" },
  { label: "外部API", id: "outerapi" },
];
export default {
  components: { ButtonTabs, FormIapicfg, FormOapicfg },
  props: {
    data: Object,
    fields: Array,
    code: String,
  },
  data() {
    this.TABS = TABS;
    return {
      curTab: "innerapi",
    };
  },
};
</script>