<template>
  <div class="pso-search-func" v-loading="searching">
    <template v-if="searchRet.length">
      <div class="pso-search-func-item" v-for="(r, i) in searchRet" :key="i">
        <div class="pso-search-func-item-body" @click="clickHandler(r)">
          <span v-html="r.display"></span>
          <span class="pso-search-func-item-type">{{ r.type_name }}</span>
        </div>
      </div>
    </template>
    <div v-else style="margin: 50px auto;">
      <pso-empty text="请输入查询条件"></pso-empty>
    </div>
    <pso-dialog :visible="showExecutor" width="96%" @close="showExecutor = false">
      <template #title>
        <div class="form-executor-header">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>{{ curWf.name }}</span>
            </div>
          </div>
        </div>
      </template>
      <pso-wf-executor ref="executor" :params="wfExecutorParams" @excuted="showExecutor = false"> </pso-wf-executor>
    </pso-dialog>
    <pso-form-executor :params="formExecutorParams" :title="curForm.name" :opener="opener"></pso-form-executor>
  </div>
</template>
<script>
import debounce from "throttle-debounce/debounce";
import { analyzeMenu } from "../../tool/app";
export default {
  data() {
    return {
      searching: false,
      keywords: "",
      searchRet: [],
      curWf: {},
      curForm: {},
      showExecutor: false,
      opener: { showExecutor: false },
    };
  },
  computed: {
    wfExecutorParams() {
      return {
        node_id: this.curWf.code,
        instance: { instanceId: "" },
        displayMode: "",
      };
    },
    formExecutorParams() {
      return {
        formId: this.curForm.code,
      };
    },
  },
  watch: {
    keywords() {
      this.deSearch();
    },
  },
  created() {
    this.deSearch = debounce(500, this.search);
  },
  methods: {
    setKeywords(keywords) {
      this.keywords = keywords;
    },
    async search() {
      this.searchRet = [];
      if (this.keywords) {
        this.searching = true;
        const ret = await this.API.searchApp({ name: this.keywords });
        ret.data.forEach((r) => {
          if (r.type_name === "菜单" || r.type_name === "流程") {
            r.display = r.name.replace(this.keywords, `<span>${this.keywords}</span>`);
            this.searchRet.push(r);
          }
        });
        this.searching = false;
      }
    },
    async clickHandler(data) {
      const { name, node_name, type_name } = data;
      if (type_name === "流程") {
        this.curWf = { code: node_name, name: name };
        this.showExecutor = true;
      } else if (type_name === "表单") {
        this.curForm = { code: node_name, name: name };
        this.opener.showExecutor = true;
      } else if (type_name === "菜单") {
        await analyzeMenu({ menu_code: node_name, uid: this.$store.state.base.user.user_id, router: this.$router });
      }
    },
  },
};
</script>