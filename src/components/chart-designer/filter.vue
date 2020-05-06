<template>
  <div class="pso-cd-option pso-cd-dimension">
    <h4>筛选{{drag}}</h4>
    <draggable
      class="pso-cd-drag"
      v-model="filter"
      :group="{ name: 'chartDesigner', pull: false, put: true }"
      ghost-class="pso-cd-drag__item-ghost"
      :animation="200"
    >
      <div class="pso-cd-drag__item" v-for="(item,index) of filter" :key="index">
        <span>{{item._fieldName}}</span>
        <i class="pso-cd-drag__item-del el-icon-close" @click="delItem(index)"></i>
      </div>
    </draggable>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { CD_FILTER_SET } from "../../store/mutation-types";

import draggable from "vuedraggable";

export default {
  components: { draggable },
  data() {
    return {};
  },
  computed: {
    ...mapState(["chartDesigner"]),
    filter: {
      get() {
        return this.chartDesigner.filter;
      },
      set(value) {
        this.$store.commit(CD_FILTER_SET, value);
      }
    }
  },
  methods: {
    delItem(index) {
      this.chartDesigner.filter.splice(index, 1);
    }
  }
};
</script>