<template>
  <div class="pso-cd-option pso-cd-dimension">
    <h4>维度</h4>
    <draggable
      class="pso-cd-drag"
      v-model="dimension"
      :group="{ name: 'chartDesigner', pull: false, put: true }"
      ghost-class="pso-cd-drag__item-ghost"
      :animation="200"
    >
      <div class="pso-cd-drag__item" v-for="(item,index) of dimension" :key="index">
        {{item._fieldName}}
        <span v-if="item.op">( {{item.op}} )</span>
        <el-dropdown trigger="click" size="small" @command="handleCommand($event,index)">
          <span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <template v-if="DIMEN_OP_LIST[item._fieldRealType]">
              <el-dropdown-item
                :command="opItem"
                :key="opItem"
                v-for="opItem of DIMEN_OP_LIST[item._fieldRealType]"
              >{{opItem}}</el-dropdown-item>
            </template>
            <el-dropdown-item command="alias" divided>设置别名</el-dropdown-item>
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
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { CD_DIMENSION_SET } from "../../store/mutation-types";
import { DIMEN_OP_LIST, SORT } from "../../const/chart";
import PsoCdAlias from "./alias";
 
import draggable from "vuedraggable"; 

export default {
  components: { draggable, PsoCdAlias },
  data() {
    return {
      DIMEN_OP_LIST: DIMEN_OP_LIST,
      SORT: SORT,
      index: 0,
      showAliasForm: false
    };
  },
  computed: {
    ...mapState(["chartDesigner"]),
    dimension: {
      get() {
        return this.chartDesigner.dimension;
      },
      set(value) {
        this.$store.commit(CD_DIMENSION_SET, value);
      }
    },
    currentItem() {
      return this.chartDesigner.dimension[this.index] || {};
    }
  },
  methods: {
    delItem(index) {
      this.chartDesigner.dimension.splice(index, 1);
    },
    handleCommand(command, index) {
      if (command === "alias") {
        //设置别名
        this.index = index;
        this.showAliasForm = true;
      } else if (command === "uniq") {
        this.chartDesigner.dimension[index].uniq = !this.chartDesigner.dimension[index].uniq;
      } else if (command) {
        if (Object.values(this.SORT).indexOf(command) !== -1) {
          this.chartDesigner.dimension[index].chartSort = command;
        } else {
          this.chartDesigner.dimension[index].op = command;
        }
      }
    }
  }
};
</script>