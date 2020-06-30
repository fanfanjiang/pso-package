<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    width="400"
    @show="opened=true"
    @after-leave="opened=false"
    v-model="show"
  >
    <div class="pso-picker" v-if="opened">
      <el-table
        ref="multipleTable"
        height="250"
        size="small"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :highlight-current-row="pattern==='radio'"
        @current-change="handleCurrentChange"
        @selection-change="handleSelectChange"
      >
        <el-table-column v-if="pattern==='checkbox'" type="selection" width="55"></el-table-column>
        <el-table-column prop="duty_name" label="职位名称"></el-table-column>
      </el-table>
      <div class="pso-picker__footer">
        <div class="pso-picker__showlist">
          <span v-for="item of selected" :key="item.duty_id">
            <el-tag>{{item.duty_name}}</el-tag>
          </span>
        </div>
      </div>
      <div class="pso-picker__controller">
        <el-button @click="show=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-plus" plain size="small">选择职位</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
export default {
  props: {
    appid: {
      type: String,
      default: "3"
    },
    show: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      default: "radio"
    }
  },
  data() {
    return {
      opened: false,
      tableData: [],
      selected: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const ret = await this.API.getOrgs("position");
      this.tableData = ret.data;
    },
    handleSelectChange(selections) {
      this.selected = selections;
    },
    handleCurrentChange(val) {
      if (this.pattern !== "radio") return;
      if (val) {
        this.selected = _.cloneDeep([val]);
      }
    },
    confirm() {
      this.$emit("confirm", this.selected);
      this.show = false;
    }
  }
};
</script>
<style lang="less" scoped>
.pso-picker__footer {
  margin-top: 10px;
}
.pso-picker__showlist {
  display: flex;
  flex-wrap: wrap;
  > span {
    margin: 2px;
    box-sizing: content-box;
  }
}
.pso-picker__controller {
  margin-top: 10px;
  text-align: right;
}
</style>