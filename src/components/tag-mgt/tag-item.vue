<template>
  <div class="pso-tag">
    <div class="pso-tag__l">
      <div class="pso-tag-controller">
        <el-button size="small" type="primary" plain @click="addHandler()">新增</el-button>
      </div>
      <el-table
        size="small"
        v-loading="loadingTable"
        :data="data"
        style="width: 100%"
        height="470"
        @row-click="instanceClick"
      >
        <el-table-column prop="tag_name" label="标签名"></el-table-column>
        <el-table-column prop="tag_type" label="标签类型" width="80"></el-table-column>
        <el-table-column label="操作" fixed="right" width="50">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="delHandler(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pso-tag__table-footer">
        <el-pagination
          background
          layout="total, prev, next"
          :total="dataTotal"
          :page-size="30"
          :current-page="page"
          @prev-click="prevClickHandler"
          @next-click="nextClickHandler"
        ></el-pagination>
      </div>
    </div>
    <div class="pso-tag__r" v-loading="loading">
      <div class="pso-tag__contet" v-if="curTag">
        <div class="pso-tag__tab">
          <el-tabs v-model="curTab">
            <el-tab-pane label="属性" name="base"></el-tab-pane>
            <template v-if="curTag.tag_meter">
              <el-tab-pane label="计量" name="cal"></el-tab-pane>
            </template>
            <el-tab-pane label="查询参数" name="search" v-if="curTag.tag_type==='searchtag'"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-tag__body" :key="curTag.node_id">
          <div v-show="curTab==='base'">
            <tag-editor :data="curTag"></tag-editor>
            <div style="text-align:right">
              <el-button size="mini" type="primary" @click="editHandler(curTag)">保 存</el-button>
            </div>
          </div>
          <tag-cal v-if="curTab==='cal'" :tag="curTag"></tag-cal>
          <tag-search v-if="curTab==='search'" :tag="curTag"></tag-search>
        </div>
      </div>
    </div>
    <el-dialog title="新增标签" append-to-body :visible.sync="showEditor" :width="'480px'">
      <tag-editor key="0" :data="newTag"></tag-editor>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveHandler(newTag)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TagCal from "./cal.vue";
import TagSearch from "./search.vue";
import TagEditor from "./tag-editor.vue";

export default {
  components: { TagCal, TagEditor, TagSearch },
  props: ["node"],
  data() {
    return {
      initializing: true,
      loadingTable: false,
      loading: false,
      data: [],
      selectedTags: [],
      curTag: null,
      curTab: "base",
      dataTotal: 0,
      page: 1,
      newTag: {
        tag_name: "",
        tag_type: "",
        tag_note: "",
        tag_meter: 0,
        tag_config: "",
        tag_set: [],
        tag_rule: [],
        tag_source: "",
        optype: 0
      },
      showEditor: false
    };
  },
  computed: {
    where() {
      return {
        page: this.page - 1
      };
    }
  },
  watch: {
    "node.node_id"() {
      this.fetch();
    }
  },
  created() {
    if (this.node) {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      this.loadingTable = true;
      const ret = await this.API.tag({
        data: { tag_code: this.node.node_id, ...this.where },
        method: "get"
      });
      if (ret.success) {
        this.data = ret.data;
        this.dataTotal = ret.count;
        if (this.data.length) {
          this.instanceClick(this.data[0]);
        } else {
          this.curTag = null;
        }
      }
      this.loadingTable = false;
    },
    instanceClick(data) {
      const tag = { ...data };
      let cfg = {};
      if (tag.tag_config) {
        cfg = JSON.parse(tag.tag_config);
      }

      if (tag.tag_type === "searchtag") {
        if (tag.tag_rule) {
          tag.tag_rule = JSON.parse(tag.tag_rule);
        } else {
          tag.tag_rule = [];
        }
      }

      tag.tag_set = cfg.tag_set || [];
      tag.tag_source = cfg.tag_source || "";
      this.curTag = tag;
    },
    prevClickHandler() {
      this.page -= 1;
    },
    nextClickHandler() {
      this.page += 1;
    },
    async getTpDetail(tp_code) {
      if (tp_code) {
        const ret = await this.API.templates({ data: { tp_code }, method: "get" });
        if (ret.success && ret.data.tp.route_setting) {
          this.curTpDetail = JSON.parse(ret.data.tp.route_setting);
        } else {
          this.curTpDetail = [];
        }
      } else {
        this.curTpDetail = [];
      }
    },
    addHandler() {
      this.showEditor = true;
    },
    delHandler(data) {
      data.optype = 2;
      this.saveHandler(data);
    },
    editHandler(data) {
      data.optype = 1;
      this.saveHandler(data);
    },
    async saveHandler(subData) {
      this.loading = true;
      const data = { ...subData, node_id: this.node.node_id };
      data.tag_config = JSON.stringify({ tag_set: data.tag_set, tag_source: data.tag_source });
      delete data.tag_source;
      delete data.tag_set;

      if (data.tag_type === "searchtag") {
        const tagRule = [];
        if (data.optype !== 2) {
          data.tag_rule.forEach(item => {
            tagRule.push({ ...item, fields: [] });
          });
          data.tag_rule = JSON.stringify(tagRule);
        }
      }

      const ret = await this.API.updateTag(data);
      this.$notify({ title: ret.success ? "成功" : "失败", type: ret.success ? "success" : "warning" });

      this.loading = false;

      this.fetch();
    }
  }
};
</script>