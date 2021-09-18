<template>
  <div></div>
</template>
<script>
import { formatJSONList } from "../../../../utils/util";
const _DATA = {
  cid: "",
  tids: [],
};
export default {
  props: {
    store: Object,
    instance: Object,
  },
  created() {
    formatJSONList([this.instance], _DATA);
  },
};
</script>