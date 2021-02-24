<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    width="360"
    @show="opened = true"
    @after-leave="afterHandler"
    v-model="show"
  >
    <div class="pso-picker" v-loading="initializing">
      <template v-if="opened && !initializing">
        <div class="pso-picker__header">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="全部" :name="TABS.all"></el-tab-pane>
            <el-tab-pane label="按部门" :name="TABS.org"></el-tab-pane>
            <el-tab-pane label="按岗位" :name="TABS.post"></el-tab-pane>
            <el-tab-pane label="按职位" :name="TABS.duty"></el-tab-pane>
            <el-tab-pane label="未分配" :name="TABS.looser"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="pso-picker__body" v-loading="loading">
          <div class="pso-picker__body-l" v-if="activeTab !== TABS.all && activeTab !== TABS.looser">
            <pso-tree-common
              v-if="activeTab === TABS.org"
              ref="tree"
              :rootable="false"
              :edit-mode="false"
              :request-options="treeOptions"
              :searchable="false"
              @node-click="nodeClickHandler"
            ></pso-tree-common>
            <div class="pso-picker-menu">
              <template v-if="activeTab === TABS.post">
                <div class="pso-tabs">
                  <el-tabs tab-position="left" v-model="curPost" @tab-click="menuChangeHandler('post_id', 'duty_id', $event)">
                    <el-tab-pane v-for="(n, i) in postData" :label="n.post_name" :name="n.post_id" :key="i">
                      <div class="pso-tabs-item" slot="label">
                        <span>{{ n.post_name }}</span>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </template>
              <template v-if="activeTab === TABS.duty">
                <div class="pso-tabs">
                  <el-tabs tab-position="left" v-model="curDuty" @tab-click="menuChangeHandler('duty_id', 'post_id', $event)">
                    <el-tab-pane v-for="(n, i) in dutyData" :label="n.duty_name" :name="n.duty_id" :key="i">
                      <div class="pso-tabs-item" slot="label">
                        <span>{{ n.duty_name }}</span>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </template>
            </div>
          </div>
          <div class="pso-picker__body-r" ref="tableWrapper">
            <div class="pso-picker__table-header">
              <pso-search v-model="options.keys.user_name.value"></pso-search>
              <el-divider direction="vertical"></el-divider>
              <el-pagination
                :small="true"
                background
                layout="pager"
                :pager-count="5"
                :total="dataTotal"
                :page-size="options.limit"
                :current-page="options.start"
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                @prev-click="prevClickHandler"
                @next-click="nextClickHandler"
              ></el-pagination>
            </div>
            <el-table
              ref="multipleTable"
              height="280"
              size="mini"
              :data="dataTable"
              tooltip-effect="dark"
              style="width: 100%"
              :highlight-current-row="pattern === 'radio'"
              @current-change="handleCurrentChange"
              @selection-change="handleAllUserSelect"
            >
              <el-table-column v-if="pattern === 'checkbox'" type="selection" width="55"></el-table-column>
              <el-table-column prop="user_name" label="用户名"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="pso-picker__footer">
          <div class="pso-picker__showlist">
            <span v-for="item of selected" :key="item.user_id">
              <el-tag>{{ item.user_name }}</el-tag>
            </span>
          </div>
        </div>
        <div class="pso-picker__controller">
          <el-button @click="show = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="confirm" size="mini">确 定</el-button>
        </div>
      </template>
    </div>
    <template slot="reference">
      <slot>
        <el-button icon="el-icon-plus" plain size="mini">选择用户</el-button>
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
  },
  data() {
    this.TABS = {
      all: "0",
      org: "99",
      post: "2",
      duty: "1",
      looser: "91",
    };
    return {
      initializing: false,
      loading: false,
      opened: false,
      activeTab: "0",
      dataTable: [],
      selected: [],
      treeOptions: {
        dbconfig: "",
        dimen: 2,
      },
      options: {
        start: 1,
        limit: 50,
        user_rel: "0",
        node_id: "",
        post_id: "",
        duty_id: "",
        search_type: "0",
        keys: {
          user_name: {
            type: "2",
            value: "",
          },
        },
        type: "UserPage",
      },
      dataTotal: 0,
      postData: [],
      dutyData: [],
      show: false,
      curPost: "",
      curDuty: "",
    };
  },
  watch: {
    activeTab: {
      handler(val) {
        this.options.user_rel = val;
        this.options.node_id = "";
        this.options.post_id = "";
        this.options.duty_id = "";
        if (val !== this.TABS.all) {
          $(this.$refs.tableWrapper).width(90);
        }

        if (val !== this.TABS.looser) {
          this.options.type = "";
        } else {
          this.options.type = "OfficeUserPage";
        }

        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout();
        });
        this.options.start = 1;

        if (val === this.TABS.post) {
          if (this.postData.length) {
            if (!this.curPost) {
              this.curPost = this.postData[0].post_id;
            }
            this.options.post_id = this.curPost;
          }
        } else if (val === this.TABS.duty) {
          if (this.dutyData.length) {
            if (!this.curDuty) {
              this.curDuty = this.dutyData[0].duty_id;
            }
            this.options.duty_id = this.curDuty;
          }
        }

        this.fetch();
      },
    },
    show(val) {
      if (val) {
        this.options.keys.user_name.value = "";
        this.fetch();
      } else {
        this.$emit("cancel");
      }
    },
    "options.start"() {
      this.fetch();
    },
    "options.limit"() {
      this.fetch();
    },
    "options.keys.user_name.value"() {
      this.deFetch();
    },
  },
  async created() {
    this.initializing = true;

    const postRet = await this.API.getOrgs("post");
    this.postData = postRet.data;

    const positionRet = await this.API.getOrgs("position");
    this.dutyData = positionRet.data;

    this.deFetch = debounce(500, (params) => {
      this.fetch(params);
    });

    this.initializing = false;
  },
  methods: {
    async fetch() {
      if (!this.show) return;
      this.loading = true;

      if (this.options.node_id) {
        this.options.user_rel = this.TABS.all;
      }

      let ret = await this.API.searchUsers({ ...this.options, start: this.options.start - 1 });
      this.loading = false;
      this.dataTable = _.uniqBy(ret.data.data, "user_id");
      this.dataTotal = ret.data.page;
    },
    handleAllUserSelect(selections) {
      this.selected = selections;
    },
    handleCurrentChange(val) {
      if (this.pattern !== "radio") return;
      if (val) {
        this.selected = _.cloneDeep([val]);
      }
    },
    confirm() {
      this.$emit("confirm", this.getUsers());
      this.show = false;
    },
    getUsers() {
      return _.cloneDeep(this.selected);
    },
    nodeClickHandler(node) {
      this.options.node_id = node.node_id;
      this.fetch();
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
    },
    menuChangeHandler(field, emptyfield, { name }) {
      this.options[field] = name;
      this.options[emptyfield] = "";
      this.fetch();
    },
    afterHandler() {
      this.opened = false;
      this.selected = [];
    },
  },
};
</script>
