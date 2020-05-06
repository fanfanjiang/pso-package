<template>
  <div class="pso-cd-source">
    <h4>参数</h4>
    <draggable
      class="pso-cd-drag__source"
      v-model="source"
      :group="{ name: 'chartDesigner', pull: 'clone', put: false }"
    >
      <div class="pso-cd-source__item" v-for="sourceItem of source" :key="sourceItem.fid">
        <i :class="getFieldIcon(sourceItem)"></i>
        <span>{{sourceItem._fieldName}}</span>
      </div>
    </draggable>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { CD_SOURCE_SET } from "../../store/mutation-types";

import draggable from "vuedraggable";
 
export default {
  components: { draggable },
  computed: {
    ...mapState(["chartDesigner"]),
    source: {
      get() {
        return this.chartDesigner.source;
      },
      set(value) {
        this.$store.commit(CD_SOURCE_SET, value);
      }
    }
  },
  methods: {
    getFieldIcon(field) {
      let icon = "fa fa-font";
      switch (field._fieldRealType) {
        case "decimal":
          icon = "fa fa-sort-numeric-desc";
          break;
        case "datetime":
          icon = "el-icon-date";
          break;
      }
      return icon;
    }
  }
};
</script>