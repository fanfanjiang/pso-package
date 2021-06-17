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
      <div class="pso-cd-drag__item" v-for="(item, i) of figure" :key="i">
        {{ item._fieldName }}
        <span>( {{ item.op }} )</span>
        <el-dropdown trigger="click" size="small" @command="handleCommand($event, i)">
          <span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="o" :key="o" v-for="o of FIGER_OP_LIST[item._fieldRealType]">{{ o }}</el-dropdown-item>
            <el-dropdown-item command="alias" divided>设置别名</el-dropdown-item>
            <el-dropdown-item command="unit" divided>设置单位</el-dropdown-item>
            <el-dropdown-item command="uniq" divided>
              <i :class="{ 'el-icon-check': chartDesigner.figure[i].uniq }"></i>去重
            </el-dropdown-item>
            <el-dropdown-item divided disabled>排序</el-dropdown-item>
            <el-dropdown-item :command="s" :key="s" v-for="s in SORT">
              <i :class="{ 'el-icon-check': chartDesigner.figure[i].chartSort === s }"></i>{{ s }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="pso-cd-drag__item-del el-icon-close" @click="delItem(i)"></i>
      </div>
    </draggable>
    <pso-cd-alias :show="showAliasForm" :params="currentItem" @saved="showAliasForm = false" @cancel="showAliasForm = false"></pso-cd-alias>
    <pso-cd-unit :show="showUnitForm" :params="currentItem" @saved="showUnitForm = false" @cancel="showUnitForm = false"></pso-cd-unit>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { CD_FIGURE_SET } from "../../store/mutation-types";
import { FIGER_OP_LIST, SORT } from "../../const/chart";

import PsoCdAlias from "./alias";
import PsoCdUnit from "./unit";

import draggable from "vuedraggable";

export default {
  components: { draggable, PsoCdAlias, PsoCdUnit },
  data() {
    return {
      FIGER_OP_LIST: FIGER_OP_LIST,
      SORT: SORT,
      index: 0,
      showAliasForm: false,
      showUnitForm: false,
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
      },
    },
    currentItem() {
      return this.chartDesigner.figure[this.index] || {};
    },
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
    },
  },
};
</script>