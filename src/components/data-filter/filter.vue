<template>
  <div class="branch-picker">
    <div class="branch-picker__name">
      <el-select
        size="small"
        filterable
        v-model="pick.field"
        @change="fieldChange"
        placeholder="请选择"
      >
        <el-option
          v-for="item in fieldsOptions"
          :key="item.fid"
          :label="item.displayName"
          :value="item.fid"
        ></el-option>
      </el-select>
    </div>
    <div class="branch-picker__body">
      <div class="branch-picker__op">
        <el-select size="small" filterable v-model="pick.op" @change="opChange" placeholder="请选择">
          <el-option v-for="item in opOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="branch-picker__value">
        <el-input size="small" v-if="pick.match===1" v-model="pick.data" placeholder="请输入内容"></el-input>
        <el-select
          size="small"
          v-else-if="pick.match===2||pick.match===3"
          v-model="pick.data"
          placeholder="请选择"
          :multiple="pick.match===3"
        >
          <el-option
            v-for="item in dataOptions"
            :key="item._optionValue"
            :label="item._optionName||item._optionValue"
            :value="item._optionValue"
          ></el-option>
        </el-select>
        <el-date-picker
          v-else-if="pick.match===4"
          size="small"
          v-model="pick.data"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          align="right"
        ></el-date-picker>
        <div v-else>
          <el-input size="small" :disabled="true" placeholder></el-input>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import { CPNT } from "../../const/form";

export default {
  props: ["pick", "fieldsOptions"],
  data() {
    return {
      opOptions: [],
      dataOptions: []
    };
  },
  methods: {
    fieldChange(fid) {
      this.pick.cpnt = _.find(this.fieldsOptions, { fid });
      this.opOptions = CPNT[this.pick.cpnt.componentid].op;
      this.pick.op = "";
      this.pick.data = "";
      this.pick.match = "";
    },
    opChange(id) {
      let op = _.find(CPNT[this.pick.cpnt.componentid].op, { id });
      this.pick.match = op.match;
      if (this.pick.match === 3 || this.pick.match === 2) {
        this.dataOptions = this.pick.cpnt._option;
      }
      if (this.pick.match === 3) {
        this.pick.data = [];
      } else {
        this.pick.data = "";
      }
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.branch-picker {
  .branch-picker__body {
    display: flex;
    margin-top: 5px;
    .branch-picker__op {
      width: 120px;
    }
    .branch-picker__value {
      flex: 1;
      margin-left: 5px;
    }
  }
  @{deep} {
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>