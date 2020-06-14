<template>
  <el-popover
    :visible-arrow="false"
    transition="el-zoom-in-top"
    placement="top-end"
    width="620"
    @show="opened=true"
    @after-leave="afterHandler"
    v-model="show"
  >
    <div class="pso-picker" v-if="opened">
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
        <div class="pso-picker__body-l" v-if="activeTab!==TABS.all&&activeTab!==TABS.looser">
          <div v-bar>
            <div>
              <pso-tree-common
                v-if="activeTab===TABS.org"
                ref="tree"
                :rootable="false"
                :edit-mode="false"
                :request-options="treeOptions"
                @node-click="nodeClickHandler"
              ></pso-tree-common>
              <div class="pso-picker-menu" v-if="activeTab===TABS.post">
                <div
                  v-for="(item,index) in postData"
                  :key="index"
                  @click="menuChangeHandler('post_id','duty_id',item.post_id)"
                >{{item.post_name}}</div>
              </div>
              <div class="pso-picker-menu" v-if="activeTab===TABS.duty">
                <div
                  v-for="(item,index) in dutyData"
                  :key="index"
                  @click="menuChangeHandler('duty_id','post_id',item.duty_id)"
                >{{item.duty_name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pso-picker__body-r" ref="tableWrapper">
          <div class="pso-picker__table-header">
            <mu-text-field v-model="options.keys.user_name.value">
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
            @selection-change="handleAllUserSelect"
          >
            <el-table-column v-if="pattern==='checkbox'" type="selection" width="55"></el-table-column>
            <el-table-column prop="user_name" label="用户名"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pso-picker__footer">
        <div class="pso-picker__showlist">
          <span v-for="item of selected" :key="item.user_id">
            <el-tag>{{item.user_name}}</el-tag>
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
        <el-button icon="el-icon-plus" plain size="small">选择用户</el-button>
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
    pattern: {
      type: String,
      default: "radio"
    }
  },
  data() {
    return {
      loading: false,
      opened: false,
      activeTab: "0",
      dataTable: [],
      selected: [],
      treeOptions: {
        appid: this.appid,
        dbconfig: "",
        dimen: 2
      },
      TABS: {
        all: "0",
        org: "99",
        post: "2",
        duty: "1",
        looser: "91"
      },
      options: {
        start: 1,
        limit: 20,
        user_rel: "0",
        node_id: "",
        post_id: "",
        duty_id: "",
        search_type: "0",
        keys: {
          user_name: {
            type: "2",
            value: ""
          }
        },
        type: "GetOfficeUserPage"
      },
      dataTotal: 0,
      postData: [],
      dutyData: [],
      show: false
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
          $(this.$refs.tableWrapper).width(300);
        }

        if (val !== this.TABS.looser) {
          this.options.type = "";
        } else {
          this.options.type = "GetOfficeUserPage";
        }

        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout();
        });
        this.options.start = 1;
        this.loadUser();
      }
    },
    show(val) {
      if (val) this.loadUser();
    },
    "options.start"() {
      this.loadUser();
    },
    "options.limit"() {
      this.loadUser();
    },
    "options.keys.user_name.value"(val) {
      if (!val) this.loadUser();
    }
  },
  async created() {
    const postRet = await this.API.getOrgs("post");
    this.postData = postRet.data;
    const positionRet = await this.API.getOrgs("position");
    this.dutyData = positionRet.data;
  },
  methods: {
    async loadUser() {
      if (!this.show) return;
      this.loading = true;

      if (this.options.node_id) {
        this.options.user_rel = this.TABS.all;
      }

      let ret = await this.API.searchUsers({ ...this.options, start: this.options.start - 1 });
      this.loading = false;
      this.dataTable = ret.data.data;
      this.dataTotal = ret.data.page;
    },
    handleAllUserSelect(selections) {
      this.selected = selections;
    },
    handleCurrentChange(val) {
      if (this.pattern !== "radio") return;
      this.selected = [val];
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
      this.loadUser();
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
      this.loadUser();
    },
    menuChangeHandler(field, emptyfield, data) {
      this.options[field] = data;
      this.options[emptyfield] = "";
      this.loadUser();
    },
    afterHandler() {
      this.opened = false;
      this.selected = [];
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/less/variable.less";
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
    flex: 1;
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