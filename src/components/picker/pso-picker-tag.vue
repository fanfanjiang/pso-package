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
      <div class="pso-picker__body" v-loading="loading">
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
        <div class="pso-picker__body-c" v-if="showCenter">
          <div class="pso-picker__ul" v-bar>
            <ul>
              <li
                v-for="(tag,index) in tagList"
                :key="index"
                @click="handleTagClick(tag)"
              >{{tag.tag_name}}</li>
            </ul>
          </div>
        </div>
        <div class="pso-picker__body-r" ref="tableWrapper" v-if="source!=='tree'">
          <div class="pso-picker__table-header">
            <mu-text-field v-model="options.keys.tag_name.value">
              <template v-slot:prepend>
                <i class="el-icon-search" @click="searchHandler"></i>
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
            <el-table-column prop="tag_name" label="标签名"></el-table-column>
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
    },
    source: {
      type: String,
      default: "tree"
    },
    treeOption: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      opened: false,
      dataTable: [],
      selected: [],
      tagList: [],
      options: {
        start: 1,
        limit: 20,
        tag_code: "",
        keys: {
          node_id: { value: "", type: 1 },
          tag_name: { value: "", type: 2 }
        }
      },
      dataTotal: 0
    };
  },
  computed: {
    treeOptions() {
      const options = {
        dimen: 5
      };
      if (this.treeOption) {
        const treeOption = this.treeOption.split(",");
        options.data_type = treeOption[0];
        options.node_id = treeOption[1];
      }
      return options;
    },
    idName() {
      return this.source === "tree" ? "node_id" : "tag_no";
    },
    displayName() {
      return this.source === "tree" ? "node_display" : "tag_name";
    },
    showCheckbox() {
      return this.source === "tree" ? this.pattern === "checkbox" : false;
    },
    pickerClass() {
      return {
        "pso-picker__l__wider": this.source === "tree",
        "pso-picker__c__show": this.showCenter
      };
    },
    pickerWidth() {
      return this.source === "tree" ? 400 : 720;
    },
    autoNodeClick() {
      return this.source !== "tree";
    },
    showCenter() {
      return this.source === "data";
    }
  },
  watch: {
    "options.start"() {
      this.fetch();
    },
    "options.limit"() {
      this.fetch();
    },
    "options.keys.tag_name.value"(val) {
      if (!val) this.fetch();
    },
    source() {
      this.selected = [];
      this.dataTable = [];
      this.tagList = [];
    },
    pattern() {
      this.selected = [];
    },
    treeOption() {
      this.options.keys.node_id.value = "";
      this.dataTable = [];
    }
  },
  methods: {
    async fetch(tag_no) {
      if (!this.show) return;
      this.loading = true;
      let ret;
      if (this.showCenter) {
        ret = await this.API.getTagLeafData({ tag_no });
      } else {
        ret = await this.API.tag({
          data: { ...this.options, keys: JSON.stringify(this.options.keys), page: this.options.start - 1 }
        });
      }
      this.loading = false;
      if (ret.success && ret.data) {
        this.dataTable = ret.data;
        this.dataTotal = typeof ret.total !== "undefined" ? ret.total : ret.data.length;
      }
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
    },
    checkSelectedNodes(list) {
      this.selected = list.filter(node => node.is_leaf);
    },
    async nodeClickHandler(node) {
      if (this.source === "tree") {
        this.checkSelectedNodes([node]);
      } else {
        if (!node.is_leaf) return;

        this.options.start = 1;
        this.options.keys.node_id.value = node.node_id;
        this.options.tag_code = node.node_id;
        if (this.showCenter) {
          const ret = await this.API.tag({
            data: { tag_code: node.node_id, start: 0, limit: 999 }
          });
          if (ret.success) {
            this.tagList = ret.data;
          }
        } else {
          this.fetch();
        }
      }
    },
    async handleTagClick({ tag_no }) {
      this.fetch(tag_no);
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
    },
    searchHandler() {
      this.fetch();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable";
.pso-picker {
  &.pso-picker__l__wider {
    .pso-picker__body-l {
      width: 100%;
      flex: 1;
    }
  }
  &.pso-picker__c__show {
    .pso-picker__body-r {
      width: calc(100% - 120px - 200px);
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
  .pso-picker__body-c {
    height: 100%;
    width: 120px;
  }
  .pso-picker__body-r {
    width: calc(100% - 200px);
  }
}
.pso-picker__ul {
  height: 100%;
  ul {
    margin: 0;
    padding: 0;
    padding-top: 30px;
    li {
      list-style: none;
      color: #666;
      font-size: 13px;
      padding: 5px 0 5px 5px;
      cursor: pointer;
      &:hover {
        background: #fff3ed;
      }
    }
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