<template>
  <div class="pso-cd-option pso-cd-dimension">
    <h4>数值</h4>
    <draggable
      class="pso-cd-drag"
      v-model="figure"
      :group="{ name: 'chartDesigner', pull: false, put: true }"
      ghost-class="pso-cd-drag__item-ghost"
      :animation="200"
    >
      <div class="pso-cd-drag__item" v-for="(item,index) of figure" :key="index">
        {{item._fieldName}}
        <span>( {{item.op}} )</span>
        <el-dropdown trigger="click" size="small" @command="handleCommand($event,index)">
          <span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="opItem"
              :key="opItem"
              v-for="opItem of FIGER_OP_LIST[item._fieldRealType]"
            >{{opItem}}</el-dropdown-item>
            <el-dropdown-item command="alias" divided>设置别名</el-dropdown-item>
            <el-dropdown-item command="unit" divided>设置单位</el-dropdown-item>
            <el-dropdown-item command="uniq" divided>去重</el-dropdown-item>
            <el-dropdown-item divided>排序</el-dropdown-item>
            <el-dropdown-item
              :command="sortItem"
              :key="sortItem"
              v-for="sortItem in SORT"
            >{{sortItem}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="pso-cd-drag__item-del el-icon-close" @click="delItem(index)"></i>
      </div>
    </draggable>
    <pso-cd-alias
      :show="showAliasForm"
      :params="currentItem"
      @saved="showAliasForm=false"
      @cancel="showAliasForm=false"
    ></pso-cd-alias>
    <pso-cd-unit
      :show="showUnitForm"
      :params="currentItem"
      @saved="showUnitForm=false"
      @cancel="showUnitForm=false"
    ></pso-cd-unit>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { CD_FIGURE_SET } from "@/store/mutation-types";
import { FIGER_OP_LIST, SORT } from "@/const/chart";

import PsoCdAlias from "@/components/chartDesigner/alias";
import PsoCdUnit from "@/components/chartDesigner/unit";

import draggable from "vuedraggable";

export default {
  components: { draggable, PsoCdAlias, PsoCdUnit },
  data() {
    return {
      FIGER_OP_LIST: FIGER_OP_LIST,
      SORT: SORT,
      index: 0,
      showAliasForm: false,
      showUnitForm: false
    };
  },
  computed: {
    ...mapState(["chartDesigner"]),
    figure: {
      get() {
        return this.chartDesigner.figure;
      },
      set(value) {
        this.$store.commit(CD_FIGURE_SET, value);
      }
    },
    currentItem() {
      return this.chartDesigner.figure[this.index] || {};
    }
  },
  methods: {
    delItem(index) {
      this.chartDesigner.figure.splice(index, 1);
    },
    handleCommand(command, index) {
      if (command === "alias") {
        //设置别名
        this.index = index;
        this.showAliasForm = true;
      }
      if (command === "unit") {
        //设置别名
        this.index = index;
        this.showUnitForm = true;
      } else if (command === "uniq") {
        this.chartDesigner.figure[index].uniq = !this.chartDesigner.figure[index].uniq;
      } else if (command) {
        if (Object.values(this.SORT).indexOf(command) !== -1) {
          this.chartDesigner.figure[index].chartSort = command;
        } else {
          this.chartDesigner.figure[index].op = command;
        }
      }
    }
  }
};
</script>