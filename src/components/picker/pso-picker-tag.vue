<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    :width="pickerWidth"
    @show="opened = true"
    @after-leave="opened = false"
    v-model="show"
  >
    <div class="pso-picker-tag" v-if="opened" :class="pickerClass">
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
                :node-data-filter="treeFilterHandler"
                :tree-style="{ 'box-shadow': 'none', 'padding-right': '15px' }"
              ></pso-tree-common>
            </div>
          </div>
        </div>
        <div class="pso-picker__body-c" v-if="showCenter">
          <div class="pso-picker__ul" v-bar>
            <ul>
              <li v-for="(tag, index) in tagList" :key="index" @click="handleTagClick(tag)">{{ tag.tag_name }}</li>
            </ul>
          </div>
        </div>
        <div class="pso-picker__body-r" ref="tableWrapper" v-if="!treeMode">
          <div class="pso-picker__table-header">
            <pso-search v-model="options.keys.tag_name.value"></pso-search>
            <el-divider direction="vertical"></el-divider>
            <el-pagination
              background
              :small="true"
              layout="pager"
              :total="dataTotal"
              :page-size="options.limit"
              :current-page="options.start"
              :pager-count="5"
              @size-change="sizeChangeHandler"
              @current-change="currentChangeHandler"
              @prev-click="prevClickHandler"
              @next-click="nextClickHandler"
            ></el-pagination>
          </div>
          <el-table
            v-if="!tableLoading"
            ref="multipleTable"
            height="290"
            size="mini"
            :data="dataTable"
            tooltip-effect="dark"
            style="width: 100%"
            :highlight-current-row="pattern === 'radio'"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectChange"
          >
            <el-table-column v-if="pattern === 'checkbox'" type="selection" width="20"></el-table-column>
            <el-table-column prop="tag_name" label="名称"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pso-picker__footer">
        <div class="pso-picker__showlist">
          <span v-for="item of selected" :key="item[idName]">
            <el-tag closable @close="handleDelSelection(item)">{{ item[displayName] }}</el-tag>
          </span>
        </div>
      </div>
      <div class="pso-picker__controller">
        <el-button @click="show = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
      </div>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-plus" plain size="mini">选择标签</el-button>
      </slot>
    </template>
  </el-popover>
</template>
<script>
import debounce from "throttle-debounce/debounce";
export default {
  props: {
    pattern: {
      type: String,
      default: "radio",
    },
    source: {
      type: String,
      default: "tree",
    },
    treeOption: {
      type: String,
      default: "",
    },
    filter: [Array, String],
  },
  data() {
    return {
      show: false,
      loading: false,
      tableLoading: false,
      opened: false,
      dataTable: [],
      selected: [],
      tagList: [],
      options: {
        start: 1,
        limit: 50,
        tag_code: "",
        keys: {
          node_id: { value: "", type: 1 },
          tag_name: { value: "", type: 2 },
        },
      },
      dataTotal: 0,
    };
  },
  computed: {
    treeOptions() {
      const options = {
        dimen: 5,
      };
      if (this.treeOption) {
        const treeOption = this.treeOption.split(",");
        options.data_type = treeOption[0];
      }
      return options;
    },
    treeMode() {
      return this.source === "tree" || this.source === "folder";
    },
    idName() {
      return this.treeMode ? "node_id" : "tag_no";
    },
    displayName() {
      return this.treeMode ? "node_display" : "tag_name";
    },
    showCheckbox() {
      return this.treeMode ? this.pattern === "checkbox" : false;
    },
    pickerClass() {
      return {
        "pso-picker__l__wider": this.treeMode,
        "pso-picker__c__show": this.showCenter,
      };
    },
    pickerWidth() {
      return this.treeMode ? 360 : this.__isMobile__ ? 360 : 500;
    },
    autoNodeClick() {
      return !this.treeMode;
    },
    showCenter() {
      return this.source === "data";
    },
  },
  watch: {
    "options.start"() {
      this.fetch();
    },
    "options.limit"() {
      this.fetch();
    },
    "options.keys.tag_name.value"(val) {
      this.deFetch();
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
    },
  },
  created() {
    this.deFetch = debounce(500, (params) => {
      this.fetch(params);
    });
  },
  methods: {
    treeFilterHandler(data) {
      if (!this.filter) return data;
      const filter = this.filter === "string" ? this.filter.split(",") : _.cloneDeep(this.filter);
      if (!this.filter.length) return data;
      return data.filter((d) => {
        let include = false;
        for (let path of d.node_path.split("-")) {
          console.log(path);
          if (filter.includes(path)) {
            include = true;
          }
        }
        return include;
      });
    },
    async fetch(tag_no) {
      if (!this.show) return;
      this.loading = true;
      let ret;
      if (this.showCenter) {
        ret = await this.API.getTagLeafData({ tag_no });
      } else {
        console.log(this.options.keys);
        ret = await this.API.tag({
          data: { ...this.options, keys: JSON.stringify(this.options.keys), page: this.options.start - 1 },
        });
      }
      this.loading = false;
      if (ret.success && ret.data) {
        this.dataTable = ret.data;
        this.dataTotal = typeof ret.count !== "undefined" ? ret.count : ret.data.length;
      }
    },
    handleSelectChange(data) {
      for (let item of data) {
        const index = _.findIndex(this.selected, { tag_no: item.tag_no });
        if (index === -1) {
          this.selected.push(item);
        }
      }
    },
    handleDelSelection(item) {
      const index = _.findIndex(this.selected, { [this.idName]: item[this.idName] });
      if (index !== -1) {
        this.selected.splice(index, 1);
      }
    },
    nodeCheckHandler(data) {
      this.checkSelectedNodes(data);
    },
    handleCurrentChange(val) {
      if (this.pattern !== "radio") return;
      if (val) {
        this.selected = _.cloneDeep([val]);
      }
    },
    confirm() {
      this.$emit("confirm", _.cloneDeep(this.selected));
      this.show = false;
    },
    checkSelectedNodes(list) {
      this.selected = list.filter((node) => (this.source === "tree" ? node.is_leaf : !node.is_leaf));
    },
    async nodeClickHandler(node) {
      if (this.treeMode) {
        this.checkSelectedNodes([node]);
      } else {
        if (!node.is_leaf) return;
        this.tableLoading = true;
        this.options.start = 1;
        this.options.keys.node_id.value = node.node_id;
        this.options.tag_code = node.node_id;
        if (this.showCenter) {
          const ret = await this.API.tag({
            data: { tag_code: node.node_id, start: 0, limit: 999 },
          });
          if (ret.success) {
            this.tagList = ret.data;
          }
        } else {
          this.fetch();
        }
        this.$nextTick(() => {
          this.tableLoading = false;
        });
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
  },
};
</script>
