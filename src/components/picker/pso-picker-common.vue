<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    :width="pickerWidth"
    @show="opened=true"
    @after-leave="opened=false"
    v-model="show"
  >
    <div class="pso-picker" v-if="opened" :class="pickerClass">
      <div class="pso-picker__header" v-if="typebarOption">
        <pso-typebar
          :skey="typebarOption.skey"
          :keys="typebarOption.keys"
          :filter="typebarOption.filter"
          v-model="typeBarVal"
        ></pso-typebar>
      </div>
      <div class="pso-picker__body">
        <div class="pso-picker__body-l">
          <div v-bar>
            <div>
              <pso-tree-common
                ref="tree"
                :rootable="false"
                :edit-mode="false"
                :request-options="treeOptions"
                @node-click="nodeClickHandler"
                :show-checkbox="showCheckbox"
                @node-checked="nodeCheckHandler"
                :check-after-load="autoNodeClick"
                :tree-style="{'box-shadow':'none','padding-right':'15px'}"
              ></pso-tree-common>
            </div>
          </div>
        </div>
        <div class="pso-picker__body-r" ref="tableWrapper" v-if="source!=='tree'">
          <div class="pso-picker__table-header">
            <mu-text-field v-model="options.filter">
              <template v-slot:prepend>
                <i class="el-icon-search"></i>
              </template>
            </mu-text-field>
            <el-divider direction="vertical"></el-divider>
            <el-pagination
              background
              :small="true"
              layout="total,prev, pager, next"
              :page-sizes="[30,50,100,200,500]"
              :total="dataTotal"
              :page-size="options.limit"
              :current-page="options.start"
              :pager-count="3"
              @size-change="sizeChangeHandler"
              @current-change="currentChangeHandler"
              @prev-click="prevClickHandler"
              @next-click="nextClickHandler"
            ></el-pagination>
          </div>
          <el-table
            v-loading="loading"
            ref="multipleTable"
            height="280"
            size="small"
            :data="dataTable"
            tooltip-effect="dark"
            style="width: 100%"
            :highlight-current-row="pattern==='radio'"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectChange"
          >
            <el-table-column v-if="pattern==='checkbox'" type="selection" width="55"></el-table-column>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              v-for="item of tableField"
              :key="item.prop"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pso-picker__footer">
        <div class="pso-picker__showlist">
          <span v-for="item of selected" :key="item[idName]">
            <el-tag>{{item[displayName]}}</el-tag>
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
        <el-button icon="el-icon-plus" plain size="small">选择标签</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
import PsoTypebar from "@/components/common/pso-typebar";
import debounce from "throttle-debounce/debounce";

export default {
  components: { PsoTypebar },
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
    },
    source: {
      type: String,
      default: "tree"
    },
    typebarOption: Object,
    treeOption: Object,
    props: Object,
    treeFilter: Function,
    nodeClickFun: Function,
    fetchTableFun: Function,
    tableField: Array
  },
  data() {
    return {
      loading: false,
      opened: false,
      dataTable: [],
      selected: [],
      options: {
        start: 1,
        limit: 20,
        filter: ""
      },
      dataTotal: 0,
      typeBarVal: {}
    };
  },
  computed: {
    treeOptions() {
      if (this.typebarOption) {
        if (!_.isEmpty(this.typeBarVal)) {
          const option = {};
          for (let key in this.treeOption) {
            if (typeof this.treeOption[key] === "string") {
              option[key] = this.treeOption[key];
            } else if (this.treeOption[key].field) {
              option[key] = this.typeBarVal[this.treeOption[key].field];
            }
          }
          return option;
        }
      } else {
        return this.treeOption;
      }
    },
    idName() {
      return this.source === "tree" ? "node_id" : this.props.tableIdName;
    },
    displayName() {
      return this.source === "tree" ? "node_name" : this.props.tableDisplayName;
    },
    showCheckbox() {
      return this.source === "tree" ? this.pattern === "checkbox" : false;
    },
    pickerClass() {
      return {
        "pso-picker__l__wider": this.source === "tree"
      };
    },
    pickerWidth() {
      return this.source === "tree" ? 400 : 620;
    },
    autoNodeClick() {
      return this.source !== "tree";
    }
  },
  watch: {
    options: {
      deep: true,
      handler() {
        this.debouncedGetData();
      }
    },
    source() {
      this.selected = [];
    },
    pattern() {
      this.selected = [];
    },
    show(val) {
      if (val) {
        this.dataTable = [];
      }
    }
  },
  created() {
    this.debouncedGetData = debounce(500, this.fetch);
  },
  methods: {
    async fetch() {
      if (!this.show) return;
      this.loading = true;

      const ret = await this.fetchTableFun(this.options);

      this.loading = false;
      this.dataTable = ret.data;
      this.dataTotal = ret.total;
    },
    handleSelectChange(data) {
      this.selected = data;
    },
    nodeCheckHandler(data) {
      this.checkSelectedNodes(data);
    },
    handleCurrentChange(val) {
      if (this.pattern !== "radio") return;
      this.selected = [val];
    },
    confirm() {
      this.$emit("confirm", _.cloneDeep(this.selected));
      this.show = false;
    },
    checkSelectedNodes(list) {
      this.selected = this.treeFilter ? this.treeFilter(list) : list;
    },
    nodeClickHandler(node) {
      if (this.source === "tree") {
        this.checkSelectedNodes([node]);
      } else {
        if (node.is_leaf) {
          this.options.start = 1;
          if (this.nodeClickFun) {
            this.nodeClickFun(node, this.options);
          }
          this.debouncedGetData();
        }
      }
    },
    sizeChangeHandler(size) {
      this.options.limit = size;
    },
    currentChangeHandler(page) {
      this.options.start = page;
    },
    prevClickHandler() {
      this.options.start -= 1;
    },
    nextClickHandler() {
      this.options.start += 1;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/less/variable";
.pso-picker {
  &.pso-picker__l__wider {
    .pso-picker__body-l {
      width: 100%;
      flex: 1;
    }
  }
}
.pso-picker__body {
  display: flex;
  height: 330px;
  width: 100%;

  .pso-picker__body-l {
    margin-right: 2px;
    width: 200px;
    height: 100%;
    > div {
      height: 100%;
    }
  }
  .pso-picker__body-r {
    width: calc(100% - 200px);
  }
}
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
.pso-picker-menu {
  padding: 10px;
  > div {
    padding: 10px 0;
    cursor: pointer;
    &:hover {
      color: @main-color;
    }
  }
}
.pso-picker__table-header {
  display: flex;
  align-items: center;
  @{deep} {
    .el-input {
      width: 140px;
    }
    .mu-input {
      margin-bottom: 0;
      width: 100px;
      font-size: 14px;
    }
    .mu-input__focus {
      color: @main-color;
    }
  }
}
</style>