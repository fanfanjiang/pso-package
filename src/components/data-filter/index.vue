<template>
  <div class="wf-panel-branchitem">
    <div
      class="wf-panel-branchitem__or"
      v-for="(orCondition,orIndex) in conditionMap"
      :key="orIndex"
    >
      <el-divider v-if="orIndex!==0" content-position="center">或</el-divider>
      <div
        class="wf-panel-branchitem__and"
        v-for="(andCondition,andIndex) in orCondition"
        :key="andIndex"
      >
        <el-divider v-if="andIndex!==0" content-position="left">且</el-divider>
        <div class="wf-panel-branchitem__picker">
          <pso-datafilteritem :pick="andCondition" :fieldsOptions="fieldsOptions"></pso-datafilteritem>
          <i
            class="wf-panel-branchitem__del el-icon-delete-solid"
            @click="delCondition({orIndex,andIndex})"
          ></i>
        </div>
      </div>
      <div class="wf-panel-branchitem__andbtn">
        <el-button
          @click="addCondition(orIndex)"
          size="mini"
          icon="el-icon-plus"
          type="success"
          plain
        >且</el-button>
      </div>
    </div>
    <div class="wf-panel-branchitem__orbtn">
      <el-button
        @click="addCondition()"
        size="mini"
        icon="el-icon-plus"
        type="success"
        plain
      >{{conditionMap.length?'或':'添加筛选条件'}}</el-button>
    </div>
  </div>
</template>
<script>
import PsoDatafilteritem from "./filter";
import { transCMapToCondition } from "../../tool/form";

export default {
  props: {
    value: [String, Array],
    condition: {
      type: Array,
      default: function() {
        return [];
      }
    },
    fieldsOptions: {
      type: Array,
      default: function() {
        return [];
      }
    },
    autoTrans: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  components: { PsoDatafilteritem },
  data() {
    return {
      conditionMap: []
    };
  },
  computed: {},
  created() {
    this.conditionMap = _.cloneDeep(this.condition);
  },
  watch: {
    conditionMap: {
      deep: true,
      handler(val, oldVal) {
        this.$emit("change", this.autoTrans ? transCMapToCondition(val) : val);
      }
    },
    fieldsOptions: {
      deep: true,
      handler(val, oldVal) {
        this.conditionMap = [];
      }
    }
  },
  methods: {
    addCondition(orIndex) {
      let condition = { cpnt: "", field: "", op: "", data: "", match: "" };
      if (typeof orIndex === "undefined") {
        this.conditionMap.push([condition]);
      } else {
        this.conditionMap[orIndex].push(condition);
      }
    },
    delCondition({ orIndex, andIndex }) {
      this.conditionMap[orIndex].splice(andIndex, 1);
      if (!this.conditionMap[orIndex].length) this.conditionMap.splice(orIndex, 1);
    }
  }
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