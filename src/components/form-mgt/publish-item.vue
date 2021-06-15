<template>
  <el-form>
    <pso-form-component :force-show="true" :cpnt="cpnt" @value-change="$emit('value-change', $event)"></pso-form-component>
  </el-form>
</template>
<script>
import PsoFormComponent from "../form-interpreter/cpnt";
import FormStore from "../form-designer/model/store.js";
export default {
  components: { PsoFormComponent },
  props: {
    data: Object,
    store: Object,
  },
  data() {
    return {
      cpnt: {},
    };
  },
  created() {
    const { id, val = "" } = this.data;
    const mockStore = new FormStore({ ...this.store.getBaseInfo(), designMode: false });
    mockStore.updateInstance({ [id]: val });

    const cpnt = mockStore.searchByField(id);
    cpnt.data._fieldName = "";
    cpnt.data._hideForever = false;
    cpnt.data._hideOnNew = false;
    if (cpnt.componentid === "asstable") {
      cpnt.data._new = false;
      cpnt.data._relate = true;
    }
    this.cpnt = cpnt;
  },
};
</script>